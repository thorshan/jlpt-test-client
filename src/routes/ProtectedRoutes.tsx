import { Navigate } from "react-router-dom";
import { LoadingScreen } from "../components/LoadingScreen";
import { useUser } from "../hooks/useUser";

export const ProtectedRoutes = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, isVerifying } = useUser();

  // Show your animated SVG loader while checking the session
  if (isVerifying) return <LoadingScreen />;

  if (!user) return <Navigate to="/" replace />;

  return <>{children}</>;
};
