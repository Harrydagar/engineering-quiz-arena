import api from "../api/axios";

export const getSubjects = async () => {
  const response = await api.get(
    "/api/quizzes/subjects/"
  );

  return response.data;
};

export const getTopics = async (subjectId) => {
  const response = await api.get(
    `/api/quizzes/topics/?subject_id=${subjectId}`
  );

  return response.data;
};

export const startQuiz = async (quizData) => {
  const response = await api.post(
    "/api/quizzes/start/",
    quizData
  );

  return response.data;
};