import { createContext, useState } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";

export const UserContext = createContext();
const initialUser = localStorage.getItem("user") || "{}";

export default function App() {
  const [user, setUser] = useState(JSON.parse(initialUser));

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <RouterProvider router={router()} />
    </UserContext.Provider>
  );
}
