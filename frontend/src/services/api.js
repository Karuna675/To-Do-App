import axios from "axios";

const API = axios.create({
  baseURL: "https://to-do-list-w0c8.onrenderender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
