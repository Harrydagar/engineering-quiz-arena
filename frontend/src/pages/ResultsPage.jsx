import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <h2>No Results Found</h2>;
  }

  const passed = state.percentage >= 50;

 return (
  <>
    <Navbar />

    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto p-6">

        <h1 className="text-5xl font-bold mb-2">
          Quiz Results
        </h1>

        <p className="text-slate-400 mb-8">
          You answered{" "}
          {state.correct_answers} out of{" "}
          {state.total_questions} questions correctly.
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-slate-800 rounded-full h-4">
            <div
              className="bg-indigo-500 h-4 rounded-full transition-all duration-500"
              style={{
                width: `${state.percentage}%`,
              }}
            />
          </div>

          <p className="mt-3 text-slate-300">
            Accuracy: {state.percentage}%
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div
            className="
              bg-slate-900
              border border-slate-800
              rounded-xl
              p-5
              shadow-lg
              hover:border-indigo-500
              transition
            "
          >
            <h3 className="font-semibold text-slate-400">
              Score
            </h3>

            <p className="text-3xl font-bold mt-2">
              {state.score}
            </p>
          </div>

          <div
            className="
              bg-slate-900
              border border-slate-800
              rounded-xl
              p-5
              shadow-lg
              hover:border-indigo-500
              transition
            "
          >
            <h3 className="font-semibold text-slate-400">
              Correct Answers
            </h3>

            <p className="text-3xl font-bold mt-2">
              {state.correct_answers}
            </p>
          </div>

          <div
            className="
              bg-slate-900
              border border-slate-800
              rounded-xl
              p-5
              shadow-lg
              hover:border-indigo-500
              transition
            "
          >
            <h3 className="font-semibold text-slate-400">
              Total Questions
            </h3>

            <p className="text-3xl font-bold mt-2">
              {state.total_questions}
            </p>
          </div>

          <div
            className="
              bg-slate-900
              border border-slate-800
              rounded-xl
              p-5
              shadow-lg
              hover:border-indigo-500
              transition
            "
          >
            <h3 className="font-semibold text-slate-400">
              Result
            </h3>

            <p
              className={`text-3xl font-bold mt-2 ${
                passed
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {passed
                ? "Passed"
                : "Failed"}
            </p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="
              px-5 py-2
              bg-indigo-600
              hover:bg-indigo-700
              rounded-lg
              transition
            "
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/subjects")
            }
            className="
              px-5 py-2
              border border-slate-700
              hover:border-indigo-500
              rounded-lg
              transition
            "
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