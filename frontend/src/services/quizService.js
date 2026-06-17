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

export const getDashboard = async () => {
  const response = await api.get(
    "/api/quizzes/dashboard/"
  );
  return response.data;
};

export const getLeaderboard = async () => {
  const response = await api.get(
    "/api/quizzes/leaderboard/"
  );
  return response.data;
};

export const getStats = async () => {
  const response = await api.get(
    "/api/quizzes/stats/"
  );
  return response.data;
};

export const getSubjectAnalytics = async () => {
  const response = await api.get(
    "/api/quizzes/analytics/subjects/"
  );
  return response.data;
};

export const getRecentAttempts = async () => {
  const response = await api.get(
    "/api/quizzes/analytics/history/"
  );
  return response.data;
};

export const getDifficultyStats = async () => {
  const response = await api.get(
    "/api/quizzes/analytics/difficulty/"
  );
  return response.data;
};

export const getDifficultyRecommendation = async () => {
  const response = await api.get(
    "/api/quizzes/analytics/recommendation/"
  );
  return response.data;
};

export const getMyAchievements = async () => {
  const response = await api.get(
    "/api/quizzes/my-achievements/"
  );
  return response.data;
};

export const getAchievementSummary = async () => {
  const response = await api.get(
    "/api/quizzes/achievements/summary/"
  );
  return response.data;
};

export const getPerformanceSummary = async () => {
  const response = await api.get(
    "/api/quizzes/analytics/summary/"
  );
  return response.data;
};

export const getUserStreak = async () => {
  const response = await api.get(
    "/api/quizzes/challenges/streak/"
  );
  return response.data;
};