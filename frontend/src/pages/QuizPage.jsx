import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  fetchQuestions,
  submitAnswer,
  finishQuiz,
} from "../services/quizService";

function QuizPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await fetchQuestions(
        attemptId
      );

      console.log("Questions:", data);

      setQuestions(data);
    } catch (error) {
      console.error(
        "Failed to load questions",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (
    questionId,
    optionId
  ) => {
    try {
      const data = await submitAnswer(
        attemptId,
        questionId,
        optionId
      );

      setAnsweredQuestions((prev) => [
        ...prev,
        questionId,
      ]);

      console.log(
        "Answer Response:",
        JSON.stringify(
          data,
          null,
          2
        )
      );
    } catch (error) {
      console.log(
        "Status:",
        error.response?.status
      );

      console.log(
        "Response:",
        JSON.stringify(
          error.response?.data,
          null,
          2
        )
      );

      console.error(error);
    }
  };

  const handleFinishQuiz = async () => {
    try {
      const data = await finishQuiz(
        attemptId
      );

      console.log(
        "Quiz Result:",
        data
      );

      navigate(
        "/results",
        {
          state: data,
        }
      );
    } catch (error) {
        console.log(
            "Status:",
            error.response?.status
        );

        console.log(
            "Response:",
            JSON.stringify(
            error.response?.data,
            null,
            2
            )
        );

        console.error(error);
        }
        };

  if (loading) {
    return (
      <h2>
        Loading Questions...
      </h2>
    );
  }

  return (
    <div>
      <h1>Quiz</h1>

      <p>
        Attempt ID: {attemptId}
      </p>

      {questions.map((question) => (
        <div
          key={question.id}
          style={{
            border:
              "1px solid #ccc",
            padding: "16px",
            margin: "16px 0",
          }}
        >
          <h3>
            {
              question.question_text
            }
          </h3>

          <p>
            Difficulty:{" "}
            {
              question.difficulty
            }
          </p>

          <div>
            {question.options
              .length > 0 ? (
              question.options.map(
                (option) => (
                  <button
                    key={
                      option.id
                    }
                    disabled={answeredQuestions.includes(
                      question.id
                    )}
                    onClick={() =>
                      handleAnswer(
                        question.id,
                        option.id
                      )
                    }
                    style={{
                      display:
                        "block",
                      width:
                        "100%",
                      textAlign:
                        "left",
                      padding:
                        "10px",
                      marginBottom:
                        "8px",
                    }}
                  >
                    {
                      option.option_text
                    }
                  </button>
                )
              )
            ) : (
              <p
                style={{
                  color:
                    "red",
                  fontWeight:
                    "bold",
                }}
              >
                No options
                available
                for this
                question
              </p>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={
          handleFinishQuiz
        }
        style={{
          padding:
            "12px 24px",
          marginTop: "20px",
        }}
      >
        Finish Quiz
      </button>
    </div>
  );
}

export default QuizPage;