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

export const forgotPassword = async (email) => {
  const response = await api.post(
    "/api/accounts/forgot-password/",
    { email }
  );

  return response.data;
};

export const resetPassword = async (
  uidb64,
  token,
  password,
  confirm_password
) => {
  const response = await api.post(
    `/api/accounts/reset-password/${uidb64}/${token}/`,
    {
      password,
      confirm_password,
    }
  );

  return response.data;
};

export const verifyEmail = async (uidb64, token) => {
  const response = await api.get(
    `/api/accounts/verify-email/${uidb64}/${token}/`
  );

  return response.data;
};

export const resendVerification = async (email) => {
  const response = await api.post(
    '/api/accounts/resend-verification/',
    { email }
  );

  return response.data;
};

export const changePassword = async (
  old_password,
  password,
  confirm_password
) => {
  const response = await api.post(
    '/api/accounts/change-password/',
    {
      old_password,
      password,
      confirm_password,
    }
  );

  return response.data;
};