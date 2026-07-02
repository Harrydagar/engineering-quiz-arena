import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  fetchQuestions,
  submitAnswer,
  finishQuiz,
} from "../services/quizService";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";


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

  const [submitting, setSubmitting] =
    useState(false);

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

  const submitCurrentQuestion =
  async () => {

      if (submitting) {
        return false;
      }

      const question =
        questions[currentQuestion];

      if (!question) {
        return false;
      }

    const selectedOption =
      selectedAnswers[
        question.id
      ];

    if (!selectedOption) {
      aletrt(
        "Please select an answer."
      );
      return false;
    }

    setSubmitting(true);

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

      return true;

    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };  

  const handleNext = async () => {

    const success =
      await submitCurrentQuestion();

    if (!success) {
      return;
    }

    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (prev) => prev + 1
      );
    }
  };


  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (prev) => prev - 1
      );
    }
  };

  const handleSkip = () => {
    if (skipsUsed >= MAX_SKIPS) {
      toast.error("You have used all 5 skips.");
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
        (prev) => prev + 1
      );
    }
  };

  const handleFinishQuiz =
  async () => {

    const success =
      await submitCurrentQuestion();

    if (!success) {
      return;
    }

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

if (
  questions.length === 0 ||
  !questions[currentQuestion]
) {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <p>No questions available.</p>
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

      <div className="max-w-4xl mx-auto px-6 py-8">

        <div className="mb-6">

          <div className="mb-3 flex items-center justify-between">

            <span className="font-medium">
              Question{" "}
              {currentQuestion + 1}
              {" / "}
              {questions.length}
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium capitalize text-gray-700">
              {question.difficulty}
            </span>

          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">

            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-300"
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

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 mb-4">
            Question {currentQuestion + 1}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed mb-8">
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
                    rounded-xl
                    border
                    font-medium
                    transition-all
                    duration-200

                    ${
                    selectedAnswers[question.id] === option.id
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
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
                0 ||
              submitting
            }
            className="
            px-5
            py-2.5
            rounded-lg
            border
            border-gray-300
            font-medium
            transition-colors
            hover:bg-gray-100
            disabled:opacity-50
            disabled:cursor-not-allowed
            "
          >
            Previous
          </button>

          <div className="flex gap-3">

            <button
              onClick={handleSkip}
              disabled={
                skipsUsed >=
                  MAX_SKIPS ||
                submitting
              }
              className="
              px-5
              py-2.5
              rounded-lg
              bg-amber-500
              text-white
              font-medium
              transition-colors
              hover:bg-amber-600
              disabled:opacity-50
              disabled:cursor-not-allowed
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
                disabled={
                  submitting
                }
                className="
                px-6
                py-2.5
                rounded-lg
                bg-blue-600
                text-white
                font-medium
                transition-colors
                hover:bg-blue-700
                disabled:opacity-50
                disabled:cursor-not-allowed
                "
              >
                Finish Quiz
              </button>
            ) : (
              <button
                onClick={
                  handleNext
                }
                disabled={
                  submitting
                }
                className="
                px-6
                py-2.5
                rounded-lg
                bg-green-600
                text-white
                font-medium
                transition-colors
                hover:bg-green-700
                disabled:opacity-50
                disabled:cursor-not-allowed
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