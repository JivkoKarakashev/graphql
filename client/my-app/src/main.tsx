// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import 'bulma/css/bulma.css';
import AuthStateContextProvider from './context/auth.tsx';
import Router from './components/Router.tsx';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <AuthStateContextProvider>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </AuthStateContextProvider>
  // </StrictMode>,
)
