import api from "../api/axios";

export const getTodayChallenge = async () => {
  const response = await api.get(
    "/api/quizzes/challenges/today/"
  );

  return response.data;
};

export const submitChallenge = async (
  selected_option_id
) => {
  const response = await api.post(
    "/api/quizzes/challenges/submit/",
    {
      selected_option_id,
    }
  );

  return response.data;
};