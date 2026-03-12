import { Route, Routes, Navigate, Outlet } from "react-router-dom";
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
import NotFound from "../ui/404";
import ExamScreen from "../ui/ExamScreen";
import Results from "../ui/Results";
import Users from "../admin/Users";
import Login from "../ui/Login";

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
      <Route path="/results" element={<Results />} />
      <Route path="/auth" element={<Login />} />

      {/* PROTECTED STUDENT ROUTES */}
      <Route
        path="/test"
        element={
          <ProtectedRoutes>
            <Outlet />
          </ProtectedRoutes>
        }
      >
        <Route index element={<Home />} />

        <Route path=":id" element={<ExamScreen />} />
      </Route>

      {/* PROTECTED ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoutes allowedRoles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoutes>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="exams" element={<Exams />} />
        <Route path="sections" element={<Sections />} />
        <Route path="questions" element={<Questions />} />
        <Route path="users" element={<Users />} />
      </Route>

      {/* 404 FALLBACK */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
