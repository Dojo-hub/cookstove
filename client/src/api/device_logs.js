import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/logs"
      : `${process.env.BASE_URL}/logs`,
});

axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) config.headers.Authorization = user.token;
  return config;
});

export function getLogs(deviceID) {
    return axiosInstance.get(`/${deviceID}`);
}