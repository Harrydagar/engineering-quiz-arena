import { useSearchParams, useNavigate } from "react-router-dom";
import { startQuiz } from "../services/quizService";
import Navbar from "../components/Navbar";



function StartQuizPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const subjectId = searchParams.get("subject");
  const topicId = searchParams.get("topic");

  const handleStartQuiz = async () => {
    try {
      const data = await startQuiz(subjectId);

      console.log("Quiz Started:", data);

      navigate(`/quiz/${data.attempt.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to start quiz");
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <h1>Start Quiz</h1>

        <p>Subject ID: {subjectId}</p>
        <p>Topic ID: {topicId}</p>

        <button onClick={handleStartQuiz}>
          Start Quiz
        </button>
      </div>
    </>
      
  );
}

export default StartQuizPage;