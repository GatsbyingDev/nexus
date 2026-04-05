import { Navigate, createBrowserRouter } from "react-router-dom";
import { DMLayout } from "@/layouts/DMLayout";
import { ServerLayout } from "@/layouts/ServerLayout";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/", element: <Navigate to="/channels/@me" replace /> },
  { path: "/channels/@me", element: <DMLayout /> },
  { path: "/channels/:serverId/:channelId", element: <ServerLayout /> }
]);
