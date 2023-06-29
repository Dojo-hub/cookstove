import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/events"
      : `${BASE_URL}/events`,
});

axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) config.headers.Authorization = user.token;
  return config;
});

export function getDeviceEvents(id) {
  return axiosInstance.get(`/${id}`);
}

export function getCookstoveData(query) {
  return axiosInstance.get("/data" + query);
}

export function getAllEventsData(query) {
  return axiosInstance.get("/events" + query);
}

export function getEventLogs(eventId) {
  return axiosInstance.get(`/logs/${eventId}`);
}
