import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Root from "./root";
import Login from "./login";
import { Devices, Details } from "./devices";
import { UserDetails, Users } from "./users";
import Dashboard from "./dashboard/Dashboard";
import Profile from "./profile";
import Analytics from "./analytics/Analytics";

export default function Routes() {
  const user = !!localStorage.getItem("user");

  return createBrowserRouter([
    {
      path: "/",
      element: user ? <Root /> : <Navigate to="/login" />,
      children: [
        {
          path: "",
          element: <Navigate to="/dashboard" />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "devices",
          element: <Outlet />,
          children: [
            {
              path: "",
              element: <Devices />,
            },
            {
              path: "details/:id",
              element: <Details />,
            },
          ],
        },
        {
          path: "users",
          element: <Outlet />,
          children: [
            {
              path: "",
              element: <Users />,
            },
            {
              path: "details/:id",
              element: <UserDetails />,
            },
          ],
        },
        {
          path: "analytics",
          element: <Analytics />,
        },
      ],
    },
    {
      path: "login",
      element: !user ? <Login /> : <Navigate to="/" />,
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);
}
