import { Route, Routes } from "react-router-dom";

import useAuth from "../hooks/useAuth.ts";

import Layout from "./Layout.tsx";
import App from "../App.tsx";
import CompanyPage from "../pages/CompanyPage.tsx";
import CreateJobPage from "../pages/CreateJobPage.tsx";
import JobPage from "../pages/JobPage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import RegisterPage from "../pages/RegisterPage.tsx";

const Router = (): React.ReactElement => {
  const { onLogin, onRegister } = useAuth();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index path='/' element={<App />} />
        <Route path='/companies/:companyId' element={<CompanyPage />} />
        <Route path='/jobs/new' element={<CreateJobPage />} />
        <Route path='/jobs/:jobId' element={<JobPage />} />
        <Route path='/login' element={<LoginPage onLogin={onLogin} />} />
        <Route path='/register' element={<RegisterPage onRegister={onRegister} />} />
      </Route>
    </Routes>
  );
};

export default Router;
