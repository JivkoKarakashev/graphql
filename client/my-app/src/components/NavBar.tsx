import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthStateContext } from '../context/auth.tsx';
import type { AuthUser } from '../api/auth.ts';

const NavBar = ({ user, onLogout }: { user: AuthUser | undefined, onLogout: () => void }): React.ReactElement => {
  const { isAuth } = useContext(AuthStateContext);

  return (
    <nav className="navbar">
      <div className="navbar-start">
        <Link className="navbar-item" to="/">Home</Link>
      </div>
      {isAuth ? (
        <div className="navbar-end">
          <span className="navbar-item has-text-grey">{user.email}</span>
          <Link className="navbar-item" to="/jobs/new">Post Job</Link>
          <a className="navbar-item" onClick={onLogout}>Logout</a>
        </div>
      ) : (
        <div className="navbar-end">
          <Link className="navbar-item" to="/login">Login</Link>
          <Link className="navbar-item" to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
