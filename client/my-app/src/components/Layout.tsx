import { useContext } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthContext } from '../context/auth.tsx';
import NavBar from './NavBar.tsx';
import useAuth from '../hooks/useAuth.ts';

const Layout = (): React.ReactElement => {
  const { user } = useContext(AuthContext);
  const { onLogout } = useAuth();

  return (
    <>
      <NavBar user={user} onLogout={onLogout} />
      <main className='section'>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;