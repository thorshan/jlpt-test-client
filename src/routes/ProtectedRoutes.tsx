import { Navigate, useLocation } from "react-router-dom";
import { LoadingScreen } from "../components/LoadingScreen";
import { useUser } from "../hooks/useUser";

interface ProtectedRoutesProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoutes = ({
  children,
  allowedRoles,
}: ProtectedRoutesProps) => {
  const { user, isVerifying } = useUser();
  const location = useLocation();

  if (isVerifying) return <LoadingScreen />;

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
