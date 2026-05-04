// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';

import 'bulma/css/bulma.css';
import AuthStateContextProvider from './context/auth.tsx';
import { apolloClient } from './lib/apolloClient.ts';
import Router from './components/Router.tsx';
import ErrorContextProvider from './context/error.tsx';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ApolloProvider client={apolloClient}>
    <BrowserRouter>
      <ErrorContextProvider>
        <AuthStateContextProvider>
          <Router />
        </AuthStateContextProvider >
      </ErrorContextProvider>
    </BrowserRouter>
  </ApolloProvider>
  // </StrictMode>,
)
