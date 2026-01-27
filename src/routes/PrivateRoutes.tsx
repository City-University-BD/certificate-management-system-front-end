import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const location = useLocation();

  const userData = localStorage.getItem("userData");
  const user = userData ? JSON.parse(userData) : null;

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
