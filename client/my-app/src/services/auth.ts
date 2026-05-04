import { gql, type TypedDocumentNode } from '@apollo/client';

import config from '../config.ts';
import { apolloClient } from '../lib/apolloClient.ts';
import type { LoginUser } from '../schemas/loginSchema.ts';
import type { PublicRegisterUser } from '../schemas/registerSchema.ts';
import { getDeviceId } from '../utils/getDeviceId.ts';

interface AuthUser {
  id: string,
  username: string,
  email: string
}

interface AuthPayload {
  accessToken: string;
  user: AuthUser;
}

interface RegisterMutationResult {
  register: AuthPayload;
}

interface LoginMutationResult {
  login: AuthPayload;
}

interface RegisterMutationVariables {
  input: {
    username: string;
    email: string;
    password: string;
  };
}

interface LoginMutationVariables {
  input: {
    email: string;
    password: string;
  };
}

interface GetMeQuery {
  me: AuthUser
}

// Access token lives in memory only — never localStorage
let accessToken: string | null = null;

const ME_QUERY: TypedDocumentNode<GetMeQuery> = gql`
  query Me {
    me {
      id
      username
      email
    }
  }
`;

const REGISTER_MUTATION: TypedDocumentNode<RegisterMutationResult, RegisterMutationVariables> = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      user {
        id
        username
        email
      }
    }
  }
`;

const LOGIN_MUTATION: TypedDocumentNode<LoginMutationResult, LoginMutationVariables> = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        username
        email
      }
    }
  }
`;

const LOGOUT_ALL_MUTATION: TypedDocumentNode<{ logoutAll: boolean }, Record<string, never>> = gql`
  mutation LogoutAll {
    logoutAll
  }
`;

const authService = {
  getAccessToken: (): string => accessToken,
  setAccessToken: (token: string): void => {
    accessToken = token;
  },
  clearAccessToken: () => {
    accessToken = null;
  },

  refresh: async (): Promise<string | null> => {
    const url = `${config.apiUrl}/auth/refresh`;
    const options: RequestInit = {
      method: 'POST',
      credentials: 'include',
      headers: { 'x-device-id': getDeviceId() }
    };
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        return null;
      }

      const { accessToken: newToken }: { accessToken: string } = await res.json();
      accessToken = newToken;
      return newToken;
    } catch {
      return null;
    }
  },

  getMe: async (): Promise<AuthUser | null> => {
    try {
      const { data } = await apolloClient.query({
        query: ME_QUERY,
        fetchPolicy: 'network-only',
      });
      return data.me ?? null;
    } catch {
      return null;
    }
  },

  register: async (userData: PublicRegisterUser): Promise<AuthPayload> => {
    const { data } = await apolloClient.mutate({
      mutation: REGISTER_MUTATION,
      variables: {
        input: {
          username: userData.username,
          email: userData.email,
          password: userData.password,
        }
      }
    });
    if (!data) {
      throw new Error('No data returned from register mutation!');
    }
    // accessToken = data.register.accessToken;
    return data.register;
  },

  login: async (userData: LoginUser): Promise<AuthPayload> => {
    const { data } = await apolloClient.mutate({
      mutation: LOGIN_MUTATION,
      variables: {
        input: {
          email: userData.email,
          password: userData.password
        }
      }
    });
    if (!data) {
      throw new Error('No data returned from login mutation!');
    }
    // accessToken = data.login.accessToken;
    return data.login
  },

  logout: async (): Promise<void> => {
    const url = `${config.apiUrl}/auth/logout`;
    const options: RequestInit = {
      method: 'POST',
      credentials: 'include',
      headers: { 'x-device-id': getDeviceId() }
    };
    try {
      await Promise.allSettled([
        // Revoke in DB via GraphQL
        apolloClient.mutate({ mutation: LOGOUT_ALL_MUTATION }),
        // Clear the httpOnly cookie via REST
        fetch(url, options)
      ]);
    } finally {
      accessToken = null;
    }
  },
};

export {
  type AuthUser,
  authService
}