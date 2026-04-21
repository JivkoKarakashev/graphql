import { useContext, useEffect } from "react";

import { AuthStateContext } from "./context/auth.tsx";
import useAuth from "./hooks/useAuth.ts";

import NavBar from "./components/NavBar.tsx";
import HomePage from "./pages/HomePage.tsx";

function App() {
  const { user } = useContext(AuthStateContext);
  const { onLogout } = useAuth();

  useEffect(() => { }, [user]);

  return (
    <>
      <NavBar user={user} onLogout={onLogout} />
      <main className="section">
        <HomePage />
      </main>
    </>
  );
}

export default App;