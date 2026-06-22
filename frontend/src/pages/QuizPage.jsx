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

  const [submittedQuestions, setSubmittedQuestions] =
    useState([]);

  const [skipsUsed, setSkipsUsed] =
    useState(0);

  const MAX_SKIPS = 5;

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

  const handleAnswer = (
    questionId,
    optionId
  ) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = async () => {
    const question =
      questions[currentQuestion];

    const selectedOption =
      selectedAnswers[
        question.id
      ];

    if (!selectedOption) {
      alert(
        "Please select an answer or skip this question."
      );
      return;
    }

    try {
      if (
        !submittedQuestions.includes(
          question.id
        )
      ) {
        await submitAnswer(
          attemptId,
          question.id,
          selectedOption
        );

        setSubmittedQuestions(
          (prev) => [
            ...prev,
            question.id,
          ]
        );
      }

      if (
        currentQuestion <
        questions.length - 1
      ) {
        setCurrentQuestion(
          currentQuestion + 1
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        currentQuestion - 1
      );
    }
  };

  const handleSkip = () => {
    if (skipsUsed >= MAX_SKIPS) {
      alert(
        "You have used all 5 skips."
      );
      return;
    }

    setSkipsUsed(
      (prev) => prev + 1
    );

    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
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
        <div className="max-w-4xl mx-auto p-6">
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

            <span className="capitalize text-gray-500">
              {question.difficulty}
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

          <div className="flex justify-between mt-2 text-sm text-gray-500">

            <span>
              Skips Remaining:
              {" "}
              {MAX_SKIPS -
                skipsUsed}
              {" / "}
              {MAX_SKIPS}
            </span>

            <span>
              Progress:
              {" "}
              {Math.round(
                progress
              )}
              %
            </span>

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

          <div className="flex gap-3">

            <button
              onClick={handleSkip}
              disabled={
                skipsUsed >=
                MAX_SKIPS
              }
              className="
                px-5 py-2
                bg-yellow-500
                text-white
                rounded-lg
                disabled:opacity-50
              "
            >
              Skip
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
                onClick={
                  handleNext
                }
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

      </div>
    </>
  );
}

export default QuizPage;