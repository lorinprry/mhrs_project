import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: React.ReactNode;
  allowedRole?: "patient" | "doctor" | "admin";
};

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const { user, loading, initialized } = useAuth();

  if (!initialized || loading) {
    return (
      <div style={{ padding: "40px", fontSize: "18px" }}>
        Yükleniyor...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}