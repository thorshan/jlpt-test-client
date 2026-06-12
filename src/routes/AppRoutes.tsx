import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { ProtectedRoutes } from "./ProtectedRoutes";

// Admin Imports
import Exams from "../admin/Exams";
import Questions from "../admin/Questions";
import Sections from "../admin/Sections";
import Dashboard from "../admin/Dashboard";
import DashboardLayout from "../admin/DashboardLayout";
import Requests from "../admin/Requests";
import Logs from "../admin/Logs";
import AdsInsights from "../admin/AdsInsights";
import Ads from "../admin/Ads";

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
import AdminResults from "../admin/Results";
import ResultDetail from "../admin/ResultDetail";
import Redirect from "../ui/Redirect";
import CollaborationClient from "../ui/Collaboration";
import Collaboration from "../admin/Collaboration";
import CollabLanding from "../ui/CollabLanding";
import Students from "../admin/Students";
import Terms from "../ui/Terms";
import Privacy from "../ui/Privacy";
import SiteMap from "../ui/SiteMap";
import Profile from "../ui/Profile";
import Download from "../components/Download";

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
      <Route path="/collabs" element={<CollabLanding />} />
      <Route path="/collabs/get-started" element={<CollaborationClient />} />
      <Route path="/user-manual" element={<UserManual />} />
      <Route path="/site-map" element={<SiteMap />} />
      <Route path="/results" element={<Results />} />
      <Route path="/auth" element={<Login />} />
      <Route path="/redirect" element={<Redirect />} />
      <Route path="/legal/terms" element={<Terms />} />
      <Route path="/legal/privacy" element={<Privacy />} />
      <Route path="/download/:id" element={<Download />} />
      <Route
        path="/:id/profile"
        element={
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        }
      />

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
          <ProtectedRoutes allowedRoles={["s-admin", "admin"]}>
            <DashboardLayout />
          </ProtectedRoutes>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="exams" element={<Exams />} />
        <Route path="sections" element={<Sections />} />
        <Route path="questions" element={<Questions />} />
        <Route
          path="users"
          element={
            <ProtectedRoutes allowedRoles={["s-admin"]}>
              <Users />
            </ProtectedRoutes>
          }
        />
        <Route
          path="students"
          element={
            <ProtectedRoutes allowedRoles={["s-admin", "admin"]}>
              <Students />
            </ProtectedRoutes>
          }
        />
        <Route
          path="collabs"
          element={
            <ProtectedRoutes allowedRoles={["s-admin"]}>
              <Collaboration />
            </ProtectedRoutes>
          }
        />
        <Route
          path="requests"
          element={
            <ProtectedRoutes allowedRoles={["s-admin"]}>
              <Requests />
            </ProtectedRoutes>
          }
        />
        <Route
          path="logs"
          element={
            <ProtectedRoutes allowedRoles={["s-admin"]}>
              <Logs />
            </ProtectedRoutes>
          }
        />
        <Route
          path="ads-insights"
          element={
            <ProtectedRoutes allowedRoles={["s-admin"]}>
              <AdsInsights />
            </ProtectedRoutes>
          }
        />
        <Route
          path="ads"
          element={
            <ProtectedRoutes allowedRoles={["s-admin", "admin"]}>
              <Ads />
            </ProtectedRoutes>
          }
        />
        <Route path="results">
          <Route index element={<AdminResults />} />
          <Route path=":id" element={<ResultDetail />} />
        </Route>
      </Route>

      {/* 404 FALLBACK */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
