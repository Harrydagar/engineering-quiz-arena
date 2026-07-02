import { useEffect, useState } from "react";
import {
  getStats,
  getSubjectAnalytics,
  getRecentAttempts,
  getDifficultyStats,
  getDifficultyRecommendation,
  getQuizInsights,
  getPerformanceSummary,
} from "../services/quizService";

import MainLayout from "../layouts/MainLayout";
import LoadingSpinner from "../components/LoadingSpinner";

function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [difficultyStats, setDifficultyStats] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [insights, setInsights] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          statsData,
          subjectsData,
          attemptsData,
          difficultyData,
          recommendationData,
          insightsData,
          summaryData,
        ] = await Promise.all([
          getStats(),
          getSubjectAnalytics(),
          getRecentAttempts(),
          getDifficultyStats(),
          getDifficultyRecommendation(),
          getQuizInsights(),
          getPerformanceSummary(),
        ]);

        setStats(statsData);
        setSubjects(subjectsData);
        setRecentAttempts(attemptsData);
        setDifficultyStats(difficultyData);
        setRecommendation(recommendationData);
        setInsights(insightsData);
        setSummary(summaryData);
      } catch (error) {
        console.error("Analytics Error:", error);
      }
    };

    fetchData();
  }, []);

  if (!stats) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Analytics
          </h1>

          <p className="mt-2 text-lg text-gray-600">
            Analyze your performance and identify areas for improvement.
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-gray-500">Total Quizzes</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {stats.total_quizzes}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-gray-500">Accuracy</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {stats.accuracy}%
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-gray-500">Total Points</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {stats.total_points}
            </h2>
          </div>

        </div>

        {/* Performance Summary */}
        {summary && (
          <>
            <h2 className="mb-5 text-2xl font-semibold text-gray-900">
              Performance Summary
            </h2>

            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-gray-500">Average Accuracy</p>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {summary.average_accuracy}%
                </h2>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-gray-500">Highest Score</p>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {summary.highest_score}
                </h2>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-gray-500">Completed Quizzes</p>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {summary.total_quizzes}
                </h2>
              </div>

            </div>
          </>
        )}

        {/* Quiz Insights */}
        {insights && (
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-semibold text-gray-900">
              Quiz Insights
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <p className="text-gray-500">Strongest Subject</p>
                <p className="mt-1 text-lg font-semibold">
                  {insights.strongest_subject}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Weakest Subject</p>
                <p className="mt-1 text-lg font-semibold">
                  {insights.weakest_subject}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Best Difficulty</p>
                <p className="mt-1 text-lg font-semibold capitalize">
                  {insights.best_difficulty}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Overall Accuracy</p>
                <p className="mt-1 text-lg font-semibold">
                  {insights.overall_accuracy}%
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Subject Performance */}
        <h2 className="mb-5 text-2xl font-semibold text-gray-900">
          Subject Performance
        </h2>

        <div className="grid gap-5 mb-8 md:grid-cols-2">
          {subjects.map((subject) => (
            <div
              key={subject.subject}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="text-lg font-bold">
                {subject.subject}
              </h3>

              <div className="mt-4 space-y-2 text-gray-700">
                <p>Attempted: {subject.attempted}</p>
                <p>Correct: {subject.correct}</p>
                <p>Accuracy: {subject.accuracy}%</p>
              </div>
            </div>
          ))}
        </div>

        {/* Difficulty Performance */}
        <h2 className="mb-5 text-2xl font-semibold text-gray-900">
          Difficulty Performance
        </h2>

        {difficultyStats && (
          <div className="grid gap-5 mb-8 md:grid-cols-3">

            {["easy", "medium", "hard"].map((level) => (
              <div
                key={level}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-lg font-bold capitalize">
                  {level}
                </h3>

                <div className="mt-4 space-y-2 text-gray-700">
                  <p>Attempted: {difficultyStats[level].attempted}</p>
                  <p>Correct: {difficultyStats[level].correct}</p>
                  <p>Accuracy: {difficultyStats[level].accuracy}%</p>
                </div>
              </div>
            ))}

          </div>
        )}

        {/* Recommendation */}
        {recommendation && (
          <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold text-blue-900">
              Recommended Difficulty
            </h2>

            <p className="text-lg font-bold capitalize text-blue-700">
              {recommendation.recommended_level}
            </p>
          </div>
        )}

        {/* Recent Attempts */}
        <h2 className="mb-5 text-2xl font-semibold text-gray-900">
          Recent Attempts
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          {recentAttempts.map((attempt) => (
            <div
              key={attempt.quiz_id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="text-lg font-bold">
                {attempt.subject}
              </h3>

              <div className="mt-4 space-y-2 text-gray-700">
                <p>Score: {attempt.score}</p>
                <p>Accuracy: {attempt.percentage}%</p>
                <p>Questions: {attempt.total_questions}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </MainLayout>
  );
}

export default AnalyticsPage;