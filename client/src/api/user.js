import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) config.headers.Authorization = user.token;
  return config;
});

export function login(data) {
  return axiosInstance.post("/login", data);
}

export function profile() {
  return axiosInstance.get("/profile");
}

export function getUsers(query) {
  return axiosInstance.get(`/admin/users${query}`);
}

export function addUser(data) {
  return axiosInstance.post("/register", data);
}

export function getUser(id) {
  return axiosInstance.get(`/admin/users/${id}`);
}

export function updateUser({ id, ...rest }) {
  return axiosInstance.put(`/admin/users/${id}`, { ...rest });
}

export function deleteUser(id) {
  return axiosInstance.delete(`/admin/users/${id}`);
}
