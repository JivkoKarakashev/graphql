import { createContext, useState } from "react";

import type { AuthUser } from "../api/auth.ts";

// interface AuthState {
//   isAuth: boolean,
//   uId: string | undefined,
//   sId: string | undefined
// }

interface AuthStateInterface {
  isAuth: boolean,
  isAuthSetter: (isAuth: boolean) => void,
  uId: string | undefined,
  uIdSetter: (uId: string | undefined) => void,
  sId: string | undefined,
  sIdSetter: (sId: string | undefined) => void,
  user: AuthUser | undefined,
  userSetter: (user: AuthUser | undefined) => void
}

const authStateInterfaceInit: AuthStateInterface = {
  isAuth: false,
  isAuthSetter: () => { },
  uId: undefined,
  uIdSetter: () => { },
  sId: undefined,
  sIdSetter: () => { },
  user: undefined,
  userSetter: () => { }
};

const AuthStateContext = createContext<AuthStateInterface>(authStateInterfaceInit);

function AuthStateContextProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  // console.log(authStateInit);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [uId, setUId] = useState<string | undefined>(undefined);
  const [sId, setSId] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<AuthUser | undefined>(undefined);

  const isAuthSetter = (isAuth: boolean) => setIsAuth(isAuth);
  const uIdSetter = (uId: string | undefined) => setUId(uId);
  const sIdSetter = (sId: string | undefined) => setSId(sId);
  const userSetter = (user: AuthUser | undefined) => setUser(user);

  return (
    <AuthStateContext.Provider value={{ isAuth, uId, sId, user, isAuthSetter, uIdSetter, sIdSetter, userSetter }}>
      {children}
    </AuthStateContext.Provider>
  );
}

export default AuthStateContextProvider;

export {
  AuthStateContext
}