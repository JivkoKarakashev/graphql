import { ApolloClient, InMemoryCache, ApolloLink, Observable, } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from "@apollo/client/errors";

import config from '../config';
import { authService } from '../services/auth';
import { getDeviceId } from '../utils/getDeviceId';

const httpLink = new HttpLink({
  uri: `${config.apiUrl}/graphql`,
  credentials: 'include',
});

// Note: SetContextLink flips the arguments — prevContext is first, request is second
const authLink = new SetContextLink((prevContext, _request) => {
  const token = authService.getAccessToken();
  return {
    ...prevContext,
    headers: {
      ...prevContext.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'x-device-id': getDeviceId()
    },
  };
});

const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (CombinedGraphQLErrors.is(error) && error.errors.some(e => e.extensions.code === 'UNAUTHENTICATED')) {
    return new Observable(observer => {
      authService.refresh()
        .then(newToken => {
          if (!newToken) {
            authService.clearAccessToken();
            observer.error(new Error('Session expired!'));
            return;
          }
          operation.setContext((prev: Record<string, any>) => ({
            headers: {
              ...prev.headers,
              Authorization: `Bearer ${newToken}`,
            },
          }));
          forward(operation).subscribe(observer);
        })
        .catch(() => {
          authService.clearAccessToken();
          observer.error(new Error('Session expired!'));
        });
    });
  }
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});