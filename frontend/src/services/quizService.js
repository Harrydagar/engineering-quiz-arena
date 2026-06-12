import api from "../api/axios";

export const getSubjects = async () => {
  const response = await api.get(
    "/api/quizzes/subjects/"
  );

  return response.data;
};

export const getTopics = async (subjectId) => {
  const response = await api.get(
    `/api/quizzes/topics/${subjectId}/`
  );

  return response.data;
};

export const startQuiz = async (subjectId) => {
  const response = await api.post(
    "/api/quizzes/start/",
    {
      subject_id: subjectId,
    }
  );

  return response.data;
};

export const fetchQuestions = async (attemptId) => {
  const response = await api.get(
    `/api/quizzes/${attemptId}/questions/`
  );

  return response.data;
};

export const submitAnswer = async (
  attemptId,
  questionId,
  optionId
) => {
  const response = await api.post(
    "/api/quizzes/submit-answer/",
    {
      attempt_id: attemptId,
      question_id: questionId,
      selected_option_id: optionId,
    }
  );

  return response.data;
};
export const finishQuiz = async (attemptId) => {
  const response = await api.post(
    "/api/quizzes/finish/",
    {
      attempt_id: attemptId,
    }
  );

  return response.data;
};