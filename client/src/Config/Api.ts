import axios from "axios";

const rawApiUrl = (import.meta.env.VITE_API_URL || "http://127.0.0.1:5454").trim().replace(/\/+$/, "");
export const API_URL = rawApiUrl.startsWith("http://") || rawApiUrl.startsWith("https://")
  ? rawApiUrl
  : `https://${rawApiUrl}`;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});



api.interceptors.request.use((config) => {

  const url = config.url || "";

  const publicRoutes = [
    "/auth/sent/login-signup-otp",
    "/auth/signin",
    "/auth/signup",
    "/sellers/sent/login-top",
    "/sellers/verify/login-top",
    "/delivery/signup",
    "/delivery/login",
  ];

  const isPublicRoute =
    publicRoutes.some(route => url.startsWith(route));

  if (isPublicRoute) {
    return config;
  }

  const path = window.location.pathname;

  let token = null;

  if (path.startsWith("/admin")) {
    token = localStorage.getItem("jwt");
  }
  else if (path.startsWith("/seller")) {
    token = localStorage.getItem("seller_jwt");
  }
  else if (path.startsWith("/delivery")) {
    token = localStorage.getItem("delivery_jwt");
  }
  else {
    token = localStorage.getItem("jwt");
  }

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});