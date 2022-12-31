import { createContext, useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { isExpired } from "react-jwt";
import router from "./routes";

export const UserContext = createContext();
const initialUser = localStorage.getItem("user") || "{}";

export default function App() {
  const [user, setUser] = useState(JSON.parse(initialUser));

  useEffect(() => {
    if (isExpired(user.token)) {
      localStorage.removeItem("user");
      window.location.reload;
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <RouterProvider router={router()} />
    </UserContext.Provider>
  );
}
