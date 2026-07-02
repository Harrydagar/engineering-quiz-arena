import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

let isRefreshing = false;
let refreshPromise = null;

const PUBLIC_ROUTES = [
  "/api/accounts/register/",
  "/api/accounts/token/",
  "/api/accounts/forgot-password/",
  "/api/accounts/reset-password/",
  "/api/accounts/verify-email/",
  "/api/accounts/resend-verification/",
];

const logoutUser = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  window.location.href = "/login";
};

// ==========================
// Request Interceptor
// ==========================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      config.url?.startsWith(route)
    );

    if (token && !isPublicRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================
// Response Interceptor
// ==========================

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      originalRequest?.url?.startsWith(route)
    );

    if (
      error.response?.status === 401 &&
      !isPublicRoute &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        if (!refresh) {
          logoutUser();
          return Promise.reject(error);
        }

        if (!isRefreshing) {
          isRefreshing = true;

          refreshPromise = axios.post(
            "http://127.0.0.1:8000/api/accounts/token/refresh/",
            {
              refresh,
            }
          );
        }

        const response = await refreshPromise;

        const newAccess = response.data.access;

        localStorage.setItem(
          "access",
          newAccess
        );

        api.defaults.headers.common.Authorization =
          `Bearer ${newAccess}`;

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        return api(originalRequest);

      } catch (refreshError) {
        logoutUser();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  }
);

export default api;