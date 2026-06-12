export const saveTokens = (tokens) => {
  localStorage.setItem("access", tokens.access);
  localStorage.setItem("refresh", tokens.refresh);
};

export const getToken = () => {
  return localStorage.getItem("access");
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};