import { Route, Routes, Navigate } from "react-router-dom";
import { ProtectedRoutes } from "./ProtectedRoutes";

// Admin Imports
import Exams from "../admin/Exams";
import Questions from "../admin/Questions";
import Sections from "../admin/Sections";
import Dashboard from "../admin/Dashboard";
import DashboardLayout from "../admin/DashboardLayout";

// UI Imports
import Index from "../ui/Index";
import Home from "../ui/Home";
import LandingPage from "../ui/LandingPage";
import { LoadingScreen } from "../components/LoadingScreen";
import UserManual from "../ui/UserManual";
import { useUser } from "../hooks/useUser";

const AppRoutes = () => {
  const { user, isVerifying } = useUser();

  if (isVerifying) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route
        path="/"
        element={user ? <Navigate to="/test" replace /> : <Index />}
      />
      <Route path="/get-started" element={<LandingPage />} />
      <Route path="/manual" element={<UserManual />} />

      {/* PROTECTED STUDENT ROUTES */}
      <Route
        path="/test"
        element={
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        }
      />

      {/* PROTECTED ADMIN ROUTES */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="exams" element={<Exams />} />
        <Route path="sections" element={<Sections />} />
        <Route path="questions" element={<Questions />} />
      </Route>

      {/* 404 FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
