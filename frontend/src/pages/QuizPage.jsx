import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  fetchQuestions,
  submitAnswer,
  finishQuiz,
} from "../services/quizService";
import LoadingSpinner from "../components/LoadingSpinner";

function QuizPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswers, setSelectedAnswers] =
    useState({});

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data =
        await fetchQuestions(attemptId);

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
      await submitAnswer(
        attemptId,
        questionId,
        optionId
      );

      setSelectedAnswers((prev) => ({
        ...prev,
        [questionId]: optionId,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleNext = () => {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        currentQuestion - 1
      );
    }
  };

  const handleFinishQuiz =
    async () => {
      try {
        const data =
          await finishQuiz(
            attemptId
          );

        navigate(
          "/results",
          {
            state: data,
          }
        );
      } catch (error) {
        console.error(error);
      }
    };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (questions.length === 0) {
    return (
      <>
        <Navbar />
        <div className="max-w-3xl mx-auto p-6">
          <p>
            No questions available.
          </p>
        </div>
      </>
    );
  }

  const question =
    questions[currentQuestion];

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">

        <div className="mb-6">

          <div className="flex justify-between mb-2">

            <span className="font-medium">
              Question{" "}
              {currentQuestion + 1}
              {" / "}
              {questions.length}
            </span>

            <span className="text-gray-500 capitalize">
              {
                question.difficulty
              }
            </span>

          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">

            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        <div className="bg-white rounded-xl shadow-md border p-6">

          <h2 className="text-2xl font-semibold mb-6">
            {
              question.question_text
            }
          </h2>

          <div className="space-y-3">

            {question.options.map(
              (option) => (
                <button
                  key={option.id}
                  onClick={() =>
                    handleAnswer(
                      question.id,
                      option.id
                    )
                  }
                  disabled={
                    selectedAnswers[
                      question.id
                    ]
                  }
                  className={`
                    w-full
                    text-left
                    p-4
                    rounded-lg
                    border
                    transition
                    ${
                      selectedAnswers[
                        question.id
                      ] ===
                      option.id
                        ? "bg-blue-100 border-blue-500"
                        : "hover:bg-gray-50"
                    }
                  `}
                >
                  {
                    option.option_text
                  }
                </button>
              )
            )}

          </div>

        </div>

        <div className="flex justify-between mt-6">

          <button
            onClick={
              handlePrevious
            }
            disabled={
              currentQuestion ===
              0
            }
            className="
              px-5 py-2
              border
              rounded-lg
              disabled:opacity-50
            "
          >
            Previous
          </button>

          {currentQuestion ===
          questions.length - 1 ? (
            <button
              onClick={
                handleFinishQuiz
              }
              className="
                px-6 py-2
                bg-green-600
                text-white
                rounded-lg
              "
            >
              Finish Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="
                px-6 py-2
                bg-blue-600
                text-white
                rounded-lg
              "
            >
              Next Question
            </button>
          )}

        </div>

      </div>
    </>
  );
}

export default QuizPage;