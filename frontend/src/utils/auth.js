export const saveTokens = (tokens) => {
  localStorage.setItem("access", tokens.access);
  localStorage.setItem("refresh", tokens.refresh);
};

export const getToken = () => {
  return localStorage.getItem("access");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refresh");
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};