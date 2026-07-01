import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { startQuiz } from "../services/quizService";
import Navbar from "../components/Navbar";

function StartQuizPage() {
  const [searchParams] =
    useSearchParams();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const subjectId =
    searchParams.get("subject");

  const topicId =
    searchParams.get("topic");

  const handleStartQuiz =
    async () => {
      try {
        setLoading(true);

        const data =
          await startQuiz(
            subjectId
          );

        navigate(
          `/quiz/${data.attempt.id}`
        );
      } catch (error) {
        console.error(error);
        alert(
          "Failed to start quiz"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
      <Navbar />

      <div className="max-w-2xl mx-auto p-6">

        <div className="bg-white rounded-xl shadow-md border p-8">

          <h1 className="text-4xl font-bold mb-4">
            Ready to Start?
          </h1>

          <p className="text-gray-500 mb-8">
            Test your knowledge and
            improve your rating.
          </p>

          <div className="space-y-4 mb-8">

            <div className="flex justify-between border-b pb-2">

              <span className="font-medium">
                Subject ID
              </span>

              <span>
                {subjectId}
              </span>

            </div>

            <div className="flex justify-between border-b pb-2">

              <span className="font-medium">
                Topic ID
              </span>

              <span>
                {topicId}
              </span>

            </div>

            <div className="flex justify-between border-b pb-2">

              <span className="font-medium">
                Questions
              </span>

              <span>
                10
              </span>

            </div>

            <div className="flex justify-between border-b pb-2">

              <span className="font-medium">
                Difficulty
              </span>

              <span>
                Mixed
              </span>

            </div>

            <div className="flex justify-between">

              <span className="font-medium">
                Rewards
              </span>

              <span>
                Rating + Points
              </span>

            </div>

          </div>

          <button
            onClick={
              handleStartQuiz
            }
            disabled={loading}
            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              py-3
              rounded-lg
              font-semibold
              transition
              disabled:opacity-50
            "
          >
            {loading
              ? "Starting Quiz..."
              : "Start Quiz"}
          </button>

        </div>

      </div>
    </>
  );
}

export default StartQuizPage;