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

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Daily Challenge
      </h1>

      <div className="border rounded-lg p-6">
        <p className="mb-2">
          Points: {challenge.points}
        </p>

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