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

      {/* PROTECTED STUDENT ROUTES */}
      <Route
        path="/test"
        element={
          <ProtectedRoutes>
            {/* This ensures all sub-routes (/test/exam, /test/:id) are protected */}
            <Outlet />
          </ProtectedRoutes>
        }
      >
        {/* path: "/test" - Defaults to Home */}
        <Route index element={<Home />} />

        {/* path: "/test/:id" - Shows the actual Exam Screen */}
        <Route path=":id" element={<ExamScreen />} />
      </Route>

      {/* PROTECTED ADMIN ROUTES */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="exams" element={<Exams />} />
        <Route path="sections" element={<Sections />} />
        <Route path="questions" element={<Questions />} />
      </Route>

      {/* 404 FALLBACK */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
