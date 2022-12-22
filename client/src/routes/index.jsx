import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Root from "./root";
import Login from "./login";
import { Devices, AddDevice, Details } from "./devices";

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
            {
              path: "add",
              element: <AddDevice />,
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
