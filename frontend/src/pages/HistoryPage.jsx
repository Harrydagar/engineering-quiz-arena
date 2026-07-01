import { useEffect, useState } from "react";
import { getQuizHistory } from "../services/historyService";
import { useNavigate } from "react-router-dom";
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
      console.log("History Data:", data);
      setHistory(data);
    } catch (err) {
      console.error("History API Error:", err);
      console.error("Response:", err.response);

      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to load quiz history"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return  <LoadingSpinner />;
  }

  if (error) {
    return (
      <div>
        <h2>Error Loading History</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="container">
        <h1>Quiz History</h1>

        {history.length === 0 ? (
          <p>No quiz attempts found.</p>
        ) : (
          history.map((attempt) => (
            <div
              key={attempt.id}
              onClick={() => navigate(`/review/${attempt.id}`)}
              className="
              bg-white
              rounded-xl
              shadow
              p-5
              mb-4
              cursor-pointer
              hover:shadow-lg
              transition
              "
              >
              <h3>{attempt.subject}</h3>

              <p>
                <strong>Attempt ID:</strong> {attempt.id}
              </p>

              <p>
                <strong>Score:</strong> {attempt.score}
              </p>

              <p>
                <strong>Accuracy:</strong> {attempt.accuracy}%
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(attempt.completed_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </MainLayout>  
  );
}

export default HistoryPage;