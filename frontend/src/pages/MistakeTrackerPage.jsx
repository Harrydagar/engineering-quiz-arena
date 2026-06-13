import { useEffect, useState } from "react";
import { getMistakes } from "../services/mistakeService";
import MainLayout from "../layouts/MainLayout";
import LoadingSpinner from "../components/LoadingSpinner";



function MistakeTrackerPage() {
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMistakes();
  }, []);

  const fetchMistakes = async () => {
    try {
      const data = await getMistakes();
      setMistakes(data);
    } catch (error) {
      console.error("Mistake API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return  <LoadingSpinner />;
  return (
    <MainLayout>
      <div className="container">
        <h1>Mistake Tracker</h1>

        <p>
          <strong>Total Mistakes:</strong> {mistakes.length}
        </p>

        {mistakes.length === 0 ? (
          <p>Excellent! No mistakes found.</p>
        ) : (
          mistakes.map((mistake, index) => (
            <div
              key={mistake.question_id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
              }}
            >
              <h3>
                #{index + 1} {mistake.question}
              </h3>

              <p>
                <strong>Difficulty:</strong> {mistake.difficulty}
              </p>

              <p>
                <strong>Your Answer:</strong> {mistake.your_answer}
              </p>

              <p>
                <strong>Correct Answer:</strong> {mistake.correct_answer}
              </p>
            </div>
          ))
        )}
      </div>
    </MainLayout>  
  );
}

export default MistakeTrackerPage;