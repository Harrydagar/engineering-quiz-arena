import { useEffect, useState } from "react";
import { getQuizHistory } from "../services/historyService";
import { useNavigate } from "react-router-dom";



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
    return <h2>Loading history...</h2>;
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
    <div className="container">
      <h1>Quiz History</h1>

      {history.length === 0 ? (
        <p>No quiz attempts found.</p>
      ) : (
        history.map((attempt) => (
          <div
            key={attempt.id}
            onClick={() => navigate(`/review/${attempt.id}`)}
            style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "8px",
                cursor: "pointer",
            }}
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
  );
}

export default HistoryPage;