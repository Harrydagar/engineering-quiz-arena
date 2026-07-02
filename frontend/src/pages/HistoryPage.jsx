import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuizHistory } from "../services/historyService";
import MainLayout from "../layouts/MainLayout";
import LoadingSpinner from "../components/LoadingSpinner";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getQuizHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to load quiz history."
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

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-red-700">
              Error Loading History
            </h2>

            <p className="mt-3 text-red-600">
              {error}
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Quiz History
          </h1>

          <p className="mt-2 text-lg text-gray-600">
            Review your previous quiz attempts and monitor your progress.
          </p>
        </div>

        {history.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">
              No Quiz Attempts Yet
            </h2>

            <p className="mt-3 text-gray-500">
              Complete your first quiz to start building your history.
            </p>
          </div>
        ) : (
          <div className="space-y-5">

            {history.map((attempt) => (
              <div
                key={attempt.id}
                onClick={() => navigate(`/review/${attempt.id}`)}
                className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {attempt.subject}
                    </h2>

                    <p className="mt-2 text-gray-500">
                      Attempt #{attempt.id}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 md:grid-cols-3">

                    <div>
                      <p className="text-sm text-gray-500">
                        Score
                      </p>

                      <p className="text-xl font-bold text-blue-600">
                        {attempt.score}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Accuracy
                      </p>

                      <p className="text-xl font-bold text-green-600">
                        {attempt.accuracy}%
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Completed
                      </p>

                      <p className="font-medium text-gray-800">
                        {new Date(
                          attempt.completed_at
                        ).toLocaleDateString()}
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </MainLayout>
  );
}

export default HistoryPage;