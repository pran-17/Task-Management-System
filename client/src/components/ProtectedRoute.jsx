import { Navigate, Outlet } from "react-router-dom";
import { loadAuth } from "../services/storage";

export default function ProtectedRoute({ allowRole }) {
  const auth = loadAuth();
  if (!auth?.token) return <Navigate to="/" replace />;
  if (allowRole && auth?.user?.role !== allowRole) return <Navigate to="/" replace />;
  return <Outlet />;
}

