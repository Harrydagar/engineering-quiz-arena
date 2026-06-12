import { useLocation } from "react-router-dom";

function ResultsPage() {
  const { state } = useLocation();

  if (!state) {
    return <h2>No Results Found</h2>;
  }

  return (
    <div>
      <h1>Quiz Results</h1>

      <p>
        Score: {state.score}
      </p>

      <p>
        Correct Answers:
        {" "}
        {state.correct_answers}
      </p>

      <p>
        Total Questions:
        {" "}
        {state.total_questions}
      </p>

      <p>
        Percentage:
        {" "}
        {state.percentage}%
      </p>

      <p>
        Status:
        {" "}
        {state.status}
      </p>
    </div>
  );
}

export default ResultsPage;