import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/auth.tsx";
import type { RegisterUser } from "../schemas/registerSchema.ts";
import type { LoginUser } from "../schemas/loginSchema.ts";

const useAuth = () => {
  const { login, register, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogin = async ({ email, password }: LoginUser): Promise<void> => {
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error("An error occurred on User's login!", err);
      throw err;
    }

  };

  const onRegister = async ({ username, email, password }: RegisterUser): Promise<void> => {
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      console.error("An error occurred on User's register!", err);
      throw err;
    }
  };

  const onLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("An error occurred on User's logout!", err);
      throw err;
    }
  };

  return {
    onLogin,
    onRegister,
    onLogout
  }

};

export default useAuth;