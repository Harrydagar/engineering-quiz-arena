import { useEffect, useState } from "react";
import { getMistakes } from "../services/mistakeService";
import MainLayout from "../layouts/MainLayout";
import LoadingSpinner from "../components/LoadingSpinner";

function MistakeTrackerPage() {
  const [mistakes, setMistakes] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchMistakes();
  }, []);

  const fetchMistakes = async () => {
    try {
      const data =
        await getMistakes();

      setMistakes(data);
    } catch (error) {
      console.error(
        "Mistake API Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Mistake Tracker
        </h1>

        <p className="text-gray-500 mt-2">
          Review your mistakes and
          improve your weak areas.
        </p>

      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <p className="text-lg">
          <strong>
            Total Mistakes:
          </strong>{" "}
          {mistakes.length}
        </p>

      </div>

      {mistakes.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">

          <h2 className="text-2xl font-bold mb-3">
            Excellent Work 🎉
          </h2>

          <p className="text-gray-500">
            No mistakes found.
          </p>

        </div>
      ) : (
        <div className="space-y-5">

          {mistakes.map(
            (mistake, index) => (
              <div
                key={
                  mistake.question_id
                }
                className="
                  bg-white
                  rounded-xl
                  shadow
                  p-6
                "
              >

                <div className="flex justify-between items-start mb-4">

                  <h3 className="font-bold text-lg">
                    #{index + 1}
                  </h3>

                  <span
                    className="
                      bg-gray-100
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      capitalize
                    "
                  >
                    {
                      mistake.difficulty
                    }
                  </span>

                </div>

                <p className="font-medium mb-5">
                  {
                    mistake.question
                  }
                </p>

                <div className="space-y-3">

                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">

                    <p className="text-red-700 font-medium">
                      ❌ Your Answer
                    </p>

                    <p>
                      {
                        mistake.your_answer
                      }
                    </p>

                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">

                    <p className="text-green-700 font-medium">
                      ✅ Correct Answer
                    </p>

                    <p>
                      {
                        mistake.correct_answer
                      }
                    </p>

                  </div>

                </div>

              </div>
            )
          )}

        </div>
      )}

    </MainLayout>
  );
}

export default MistakeTrackerPage;