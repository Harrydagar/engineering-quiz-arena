import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center shadow-sm">
            <h2 className="text-3xl font-bold mb-3">
              No Results Found
            </h2>

            <p className="text-slate-400 mb-6">
              Complete a quiz to view your results.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  const passed = state.percentage >= 50;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Quiz Results
            </h1>

            <p className="mt-3 text-lg text-slate-400">
              You answered{" "}
              <span className="font-semibold text-white">
                {state.correct_answers}
              </span>{" "}
              out of{" "}
              <span className="font-semibold text-white">
                {state.total_questions}
              </span>{" "}
              questions correctly.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-10">
            <div className="h-4 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-700"
                style={{
                  width: `${state.percentage}%`,
                }}
              />
            </div>

            <div className="mt-3 flex justify-between text-sm text-slate-400">
              <span>Accuracy</span>
              <span>{state.percentage}%</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm transition-all duration-200 hover:border-indigo-500 hover:-translate-y-1">
              <p className="text-sm text-slate-400">
                Score
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                {state.score}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm transition-all duration-200 hover:border-green-500 hover:-translate-y-1">
              <p className="text-sm text-slate-400">
                Correct Answers
              </p>

              <h2 className="mt-3 text-4xl font-bold text-green-400">
                {state.correct_answers}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm transition-all duration-200 hover:border-blue-500 hover:-translate-y-1">
              <p className="text-sm text-slate-400">
                Total Questions
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                {state.total_questions}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1">
              <p className="text-sm text-slate-400">
                Result
              </p>

              <h2
                className={`mt-3 text-4xl font-bold ${
                  passed
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {passed ? "Passed" : "Failed"}
              </h2>
            </div>

          </div>

          {/* Summary */}
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="mb-3 text-xl font-semibold">
              Performance Summary
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">

              <div className="rounded-xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">
                  Correct Answers
                </p>

                <p className="mt-2 text-2xl font-bold text-green-400">
                  {state.correct_answers}
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-4">
                <p className="text-sm text-slate-400">
                  Incorrect Answers
                </p>

                <p className="mt-2 text-2xl font-bold text-red-400">
                  {state.total_questions - state.correct_answers}
                </p>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/subjects")}
              className="rounded-lg border border-slate-700 px-6 py-3 font-medium text-white transition-colors hover:border-indigo-500 hover:bg-slate-900"
            >
              Take Another Quiz
            </button>

          </div>

        </div>
      </div>
    </>
  );
}

export default ResultsPage;