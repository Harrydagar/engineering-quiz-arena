import api from "../api/axios";

export const getQuizReview = async (attemptId) => {
  const response = await api.get(
    `/api/quizzes/review/${attemptId}/`
  );

  return response.data;
};