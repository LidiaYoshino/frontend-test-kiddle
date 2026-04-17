import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import { AppointmentsPage } from "../features/appointments/AppointmentsPage";
import { Dashboard } from "../features/home/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "appointments", element: <AppointmentsPage /> }
    ]
  }
]);
