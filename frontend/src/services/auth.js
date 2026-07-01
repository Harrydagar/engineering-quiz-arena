import api from "../api/axios";

export const loginUser = async (credentials) => {
  const response = await api.post(
    "/api/accounts/token/",
    credentials
  );

  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post(
    "/api/accounts/register/",
    userData
  );

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get(
    "/api/accounts/profile/"
  );

  return response.data;
};
