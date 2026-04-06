import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EmployeeLogin from "./pages/EmployeeLogin.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute allowRole="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="/employee" element={<Navigate to="/employee/login" replace />} />
        <Route path="/employee/login" element={<EmployeeLogin />} />
        <Route element={<ProtectedRoute allowRole="employee" />}>
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

