import { useEffect, useState } from "react";

import {
  getTodayChallenge,
  submitChallenge,
} from "../services/dailyChallenge";

function DailyChallengePage() {
  const [challenge, setChallenge] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenge();
  }, []);

  const fetchChallenge = async () => {
    try {
      const data = await getTodayChallenge();
      setChallenge(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption) return;

    try {
      const data = await submitChallenge(
        selectedOption
      );

      setResult(data);

      fetchChallenge();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!challenge) {
    return <div>No challenge available.</div>;
  }

  if (challenge.is_completed) {
    return (
      <div className="max-w-3xl mx-auto p-6">

        <div className="bg-green-50 border rounded-xl p-8">

          <h2 className="text-2xl font-bold mb-3">
            Challenge Completed
          </h2>

          <p>
            Come back tomorrow for a new challenge.
          </p>

          <p className="mt-3">
            Points Earned:
            {" "}
            {challenge.earned_points}
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Daily Challenge
      </h1>

      <div className="border rounded-lg p-6">
        <div className="flex gap-2 mb-4 flex-wrap">

          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {challenge.points} Points
          </span>

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            +{challenge.rating_reward} Rating
          </span>

          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm capitalize">
            {challenge.difficulty}
          </span>

        </div>

        <h2 className="text-xl font-semibold mb-4">
          {challenge.question}
        </h2>

        <div className="space-y-3">
          {challenge.options.map((option) => (
            <label
              key={option.id}
              className="flex gap-2"
            >
              <input
                type="radio"
                name="option"
                value={option.id}
                onChange={() =>
                  setSelectedOption(option.id)
                }
              />

              {option.option_text}
            </label>
          ))}
        </div>

        {!challenge.is_completed && (
          <button
            onClick={handleSubmit}
            className="mt-6 px-4 py-2 border rounded"
          >
            Submit
          </button>
        )}

        {result && (
          <div className="mt-6">
            <p>
              {result.correct
                ? "Correct!"
                : "Incorrect!"}
            </p>

            <p>
              Points Earned:{" "}
              {result.earned_points}
            </p>

            <p>
              Correct Answer:{" "}
              {result.correct_option}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyChallengePage;