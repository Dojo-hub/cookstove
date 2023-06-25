import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/devices"
      : `${process.env.BASE_URL}/devices`,
});

axiosInstance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) config.headers.Authorization = user.token;
  return config;
});

export function getAll(query) {
  return axiosInstance.get(`/${query}`);
}

export function getOne(id) {
  return axiosInstance.get(`/${id}`);
}

export function getCookingPercentages(id) {
  return axiosInstance.get(`/${id}/cooking-percentages`);
}

export function createCookingPercentages(id, data) {
  return axiosInstance.post(`/${id}/cooking-percentages`, data);
}

export function updateCookingPercentages(id, data) {
  return axiosInstance.put(`/${id}/cooking-percentages`, data);
}

export function updateDevice({ id, ...rest }) {
  delete rest.userID;
  return axiosInstance.put(`/${id}`, { ...rest });
}

export function addDevice(data) {
  return axiosInstance.post("/", data);
}

export function deleteDevice(id) {
  return axiosInstance.delete(`/${id}`);
}
