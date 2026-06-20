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
  const [difficultyStats, setDifficultyStats] =
    useState(null);
  const [recommendation, setRecommendation] =
    useState(null);
  const [insights, setInsights] =
    useState(null);
  const [summary, setSummary] =
    useState(null);

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
        setRecommendation(
          recommendationData
        );
        setInsights(insightsData);
        setSummary(summaryData);
      } catch (error) {
        console.error(
          "Analytics Error:",
          error
        );
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

      <h1 className="text-4xl font-bold mb-8">
        Analytics
      </h1>

      {/* Overall Stats */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">
            Total Quizzes
          </p>

          <h2 className="text-3xl font-bold">
            {stats.total_quizzes}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">
            Accuracy
          </p>

          <h2 className="text-3xl font-bold">
            {stats.accuracy}%
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">
            Total Points
          </p>

          <h2 className="text-3xl font-bold">
            {stats.total_points}
          </h2>
        </div>

      </div>

      {/* Performance Summary */}

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">
              Average Accuracy
            </p>

            <h2 className="text-3xl font-bold">
              {summary.average_accuracy}%
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">
              Highest Score
            </p>

            <h2 className="text-3xl font-bold">
              {summary.highest_score}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">
              Completed Quizzes
            </p>

            <h2 className="text-3xl font-bold">
              {summary.total_quizzes}
            </h2>
          </div>

        </div>
      )}

      {/* Quiz Insights */}

      {insights && (
        <div className="bg-white p-6 rounded-xl shadow mb-8">

          <h2 className="text-2xl font-bold mb-4">
            Quiz Insights
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <p className="text-gray-500">
                Strongest Subject
              </p>

              <p className="font-bold text-lg">
                {insights.strongest_subject}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                Weakest Subject
              </p>

              <p className="font-bold text-lg">
                {insights.weakest_subject}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                Best Difficulty
              </p>

              <p className="font-bold text-lg capitalize">
                {insights.best_difficulty}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                Overall Accuracy
              </p>

              <p className="font-bold text-lg">
                {insights.overall_accuracy}%
              </p>
            </div>

          </div>

        </div>
      )}

      {/* Subject Performance */}

      <h2 className="text-2xl font-bold mb-4">
        Subject Performance
      </h2>

      <div className="grid md:grid-cols-2 gap-4 mb-8">

        {subjects.map((subject) => (
          <div
            key={subject.subject}
            className="bg-white p-5 rounded-xl shadow"
          >
            <h3 className="font-bold text-lg">
              {subject.subject}
            </h3>

            <p>
              Attempted:
              {" "}
              {subject.attempted}
            </p>

            <p>
              Correct:
              {" "}
              {subject.correct}
            </p>

            <p>
              Accuracy:
              {" "}
              {subject.accuracy}%
            </p>

          </div>
        ))}

      </div>

      {/* Difficulty Performance */}

      <h2 className="text-2xl font-bold mb-4">
        Difficulty Performance
      </h2>

      {difficultyStats && (
        <div className="grid md:grid-cols-3 gap-4 mb-8">

          {["easy", "medium", "hard"].map(
            (level) => (
              <div
                key={level}
                className="bg-white p-5 rounded-xl shadow"
              >
                <h3 className="font-bold capitalize">
                  {level}
                </h3>

                <p>
                  Attempted:
                  {" "}
                  {
                    difficultyStats[level]
                      .attempted
                  }
                </p>

                <p>
                  Correct:
                  {" "}
                  {
                    difficultyStats[level]
                      .correct
                  }
                </p>

                <p>
                  Accuracy:
                  {" "}
                  {
                    difficultyStats[level]
                      .accuracy
                  }
                  %
                </p>

              </div>
            )
          )}

        </div>
      )}

      {/* Recommendation */}

      {recommendation && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">

          <h2 className="text-xl font-bold mb-2">
            Recommended Difficulty
          </h2>

          <p className="text-lg capitalize">
            {
              recommendation
                .recommended_level
            }
          </p>

        </div>
      )}

      {/* Recent Attempts */}

      <h2 className="text-2xl font-bold mb-4">
        Recent Attempts
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        {recentAttempts.map((attempt) => (
          <div
            key={attempt.quiz_id}
            className="bg-white p-5 rounded-xl shadow"
          >
            <h3 className="font-bold">
              {attempt.subject}
            </h3>

            <p>
              Score:
              {" "}
              {attempt.score}
            </p>

            <p>
              Accuracy:
              {" "}
              {attempt.percentage}%
            </p>

            <p>
              Questions:
              {" "}
              {attempt.total_questions}
            </p>

          </div>
        ))}

      </div>

    </MainLayout>
  );
}

export default AnalyticsPage;