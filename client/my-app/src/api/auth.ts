import config from '../config';

interface AuthUser {
  id: string,
  username: string,
  email: string
}

interface RegisterUser {
  username: string,
  email: string,
  password: string,
  rePassword: string
}

const login = async (email: string, password: string): Promise<AuthUser> => {
  const options: RequestInit = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
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