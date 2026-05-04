import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { authService, type AuthUser } from "../services/auth";
import { apolloClient } from "../lib/apolloClient";
import SessionWarningModal from "../components/SessionWarningModal";
import useSessionTimeout from "../hooks/useSessionTimeout";

interface AuthState {
  user: AuthUser | null,
  accessToken: string | null,
  isLoading: boolean,
  isAuthenticated: boolean
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>,
  register: (username: string, email: string, password: string) => Promise<void>,
  logout: (reason?: 'user' | 'expired') => Promise<void>,
  setAuth: (user: AuthUser, token: string) => void,
  clearAuth: () => void
}

const authContextValueInit: AuthContextValue = {
  user: null,
  accessToken: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => { },
  register: async () => { },
  logout: async () => { },
  setAuth: () => { },
  clearAuth: () => { }
};

// const TOKEN_TTL_MS = 15 * 60 * 1000;      // must match ACCESS_TOKEN_TTL
// const WARNING_BEFORE_MS = 2 * 60 * 1000;  // show warning 2 min before expiry
const TOKEN_TTL_MS = 1 * 60 * 1000;      // must match ACCESS_TOKEN_TTL
const WARNING_BEFORE_MS = 30 * 1000;  // show warning 30 sec before expiry
const WARNING_DURATION_S = 30;           // countdown duration in seconds
// const WARNING_DURATION_S = 120;           // countdown duration in seconds

const AuthContext = createContext<AuthContextValue>(authContextValueInit);

function AuthContextProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_DURATION_S);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const isAuthenticated = !!user;

  const setAuth = useCallback((user: AuthUser, token: string) => {
    setUser(user);
    setAccessToken(token);
    authService.setAccessToken(token);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    authService.clearAccessToken();
  }, []);

  const stopCountdown = useCallback(() => {
    if (countdownTimer.current) {
      clearInterval(countdownTimer.current);
      countdownTimer.current = null;
    }
    setCountdown(WARNING_DURATION_S);
    setShowWarning(false);
  }, []);

  const startCountdown = useCallback(() => {
    setCountdown(WARNING_DURATION_S);
    setShowWarning(true);
    countdownTimer.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const logout = useCallback(async (reason: 'user' | 'expired' = 'user') => {
    try {
      await authService.logout();
    }
    finally {
      clearAuth();
      stopCountdown();
      await apolloClient.clearStore();

      const url = reason === 'expired' ? '/login?reason=expired' : '/login';
      navigate(url, { replace: true });
    }
  }, [clearAuth, stopCountdown, navigate]);

  const handleSessionExpired = useCallback(async () => {
    stopCountdown();
    await logout('expired');
  }, [stopCountdown, logout]);

  const handleContinueSession = useCallback(async () => {
    stopCountdown();
    try {
      const newToken = await authService.refresh();
      if (newToken) {
        const userData = await authService.getMe();
        if (userData) {
          setAuth(userData, newToken);
        }
      } else {
        await logout('expired');
      }
    } catch {
      await logout('expired');
    }
  }, [stopCountdown, setAuth, logout]);

  // Clean up countdown on unmount
  useEffect(() => () => stopCountdown(), [stopCountdown]);

  useSessionTimeout({
    accessToken,
    tokenTtlMs: TOKEN_TTL_MS,
    warningBeforeMs: WARNING_BEFORE_MS,
    onWarning: startCountdown,
    onExpired: handleSessionExpired,
  });

  const login = useCallback(async (email: string, password: string) => {
    const { user, accessToken } = await authService.login({ email, password });
    setAuth(user, accessToken);
  }, [setAuth]);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const { user, accessToken } = await authService.register({ username, email, password });
    setAuth(user, accessToken);
  }, [setAuth]);

  // Restore session on app load
  useEffect(() => {
    authService.refresh()
      .then(async (token) => {
        if (token) {
          const userData = await authService.getMe();
          if (userData) {
            setAuth(userData, token);
          }
        }
      })
      .catch(() => { })
      .finally(() => setIsLoading(false));
  }, [setAuth]);

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, isAuthenticated, login, register, logout, setAuth, clearAuth }}>
      {children}
      <SessionWarningModal
        isOpen={showWarning}
        secondsRemaining={countdown}
        onContinue={handleContinueSession}
        onLogout={() => logout('user')}
      />
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;

export {
  AuthContext
}