import api from "../api/axios";

export const getQuizHistory = async () => {
  const response = await api.get("/api/quizzes/history/");
  return response.data;
};