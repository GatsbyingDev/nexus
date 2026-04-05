import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { DMLayout } from "@/layouts/DMLayout";
import { ServerLayout } from "@/layouts/ServerLayout";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/stores/authStore";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const App = () => {
  const initialize = useAuthStore((state) => state.initialize);
  useSocket();

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to="/channels/@me" replace />} />
      <Route
        path="/channels/@me"
        element={
          <ProtectedRoute>
            <DMLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/channels/:serverId"
        element={
          <ProtectedRoute>
            <ServerLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/channels/:serverId/:channelId"
        element={
          <ProtectedRoute>
            <ServerLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
