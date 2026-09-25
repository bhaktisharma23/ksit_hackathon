import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || "Unknown API error";
    return Promise.reject({ message, statusCode: error.response?.status });
  }
);