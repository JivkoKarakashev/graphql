import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthStateContext } from "../context/auth.tsx";
import { login, register, type RegisterUser } from "../api/auth.ts";

const useAuth = () => {
  const { isAuthSetter, uIdSetter, userSetter } = useContext(AuthStateContext);
  const navigate = useNavigate();

  const onLogin = async (email: string, password: string): Promise<void> => {
    try {
      const authUser = await login(email, password);
      isAuthSetter(!!authUser);
      userSetter(authUser ?? undefined);
      uIdSetter(authUser.id ?? undefined);
      navigate('/');
    } catch (err) {
      console.error("An error occurred on User's login!", err);
      throw err;
    } 
    
  };

  const onRegister = async (userData: RegisterUser): Promise<void> => {
    try {
      const authUser = await register(userData);
      isAuthSetter(!!authUser);
      userSetter(authUser ?? undefined);
      uIdSetter(authUser.id ?? undefined);
      navigate('/');
    } catch (err) {
      console.error("An error occurred on User's register!", err);
      throw err;
    }
  };

  const onLogout = async () => {
    // TODO User's logout logic implementation
    try {
      isAuthSetter(false);
      userSetter(undefined);
      uIdSetter(undefined);
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