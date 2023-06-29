import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/logs"
      : `${BASE_URL}/logs`,
});

axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) config.headers.Authorization = user.token;
  return config;
});

export function getLogs(deviceID, query) {
  return axiosInstance.get(`/${deviceID}${query}`);
}
