import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizReview } from "../services/reviewService";
import LoadingSpinner from "../components/LoadingSpinner";



function QuizReviewPage() {
  const { attemptId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReview();
  }, []);

  const fetchReview = async () => {
    try {
      const data = await getQuizReview(attemptId);
      setQuestions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2>Loading Review...</h2>;

  return (
    <div className="container">
      <h1>Quiz Review</h1>

      {questions.map((q, index) => (
        <div
          key={q.question_id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          <h3>
            Q{index + 1}. {q.question}
          </h3>

          <p>
            <strong>Difficulty:</strong> {q.difficulty}
          </p>

          <p>
            <strong>Your Answer:</strong> {q.your_answer}
          </p>

          <p>
            <strong>Correct Answer:</strong> {q.correct_answer}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {q.is_correct ? "✅ Correct" : "❌ Incorrect"}
          </p>
        </div>
      ))}
    </div>
  );
}

export default QuizReviewPage;