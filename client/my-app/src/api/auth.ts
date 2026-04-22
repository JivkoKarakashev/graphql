import config from '../config.ts';
import type { LoginUser } from '../schemas/loginSchema.ts';
import type { RegisterUser } from '../schemas/registerSchema.ts';

interface AuthUser {
  id: string,
  username: string,
  email: string
}

const login = async (userData: LoginUser): Promise<AuthUser> => {
  const options: RequestInit = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  };
  const res = await fetch(`${config.apiUrl}/login`, options);

  if (!res.ok) {
    return null;
  }
  const authUser: AuthUser = await res.json();
  return authUser;
};

const register = async (userData: RegisterUser): Promise<AuthUser> => {
  const options: RequestInit = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  }
  const res = await fetch(`${config.apiUrl}/register`, options);

  if (!res.ok) {
    return null;
  }
  const authUser: AuthUser = await res.json();
  return authUser;
};

export {
  type AuthUser,
  login,
  register
}