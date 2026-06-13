import api from "../api/axios";

export const getMistakes = async () => {
  const response = await api.get("/api/quizzes/mistakes/");
  return response.data;
};