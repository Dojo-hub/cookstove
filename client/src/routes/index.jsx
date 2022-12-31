import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Root from "./root";
import Login from "./login";
import { Devices, Details } from "./devices";
import { UserDetails, Users } from "./users";

export default function Routes() {
  const user = !!localStorage.getItem("user");

  return createBrowserRouter([
    {
      path: "/",
      element: user ? <Root /> : <Navigate to="/login" />,
      children: [
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
      ],
    },
    {
      path: "login",
      element: !user ? <Login /> : <Navigate to="/devices" />,
    },
    {
      path: "*",
      element: <Navigate to="/devices" replace />,
    },
  ]);
}
