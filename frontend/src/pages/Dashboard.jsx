import { useEffect, useState } from "react";
import { getProfile } from "../services/auth";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import {
  getDashboard,
  getPerformanceSummary,
  getUserStreak,
} from "../services/quizService";
import MainLayout from "../layouts/MainLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { getTodayChallenge } from "../services/dailyChallenge";

function Dashboard() {
  const [dailyChallenge, setDailyChallenge] = useState(null);

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const [summary, setSummary] = useState({
    total_quizzes: 0,
    average_accuracy: 0,
    highest_score: 0,
  });

  const [streak, setStreak] = useState({
    current_streak: 0,
    longest_streak: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDashboard = async () => {
      try {
        const [
          dashboardResult,
          summaryResult,
          streakResult,
          challengeResult,
        ] = await Promise.allSettled([
          getDashboard(),
          getPerformanceSummary(),
          getUserStreak(),
          getTodayChallenge(),
        ]);

        if (dashboardResult.status === "fulfilled") {
          setDashboard(dashboardResult.value);
        }

        if (summaryResult.status === "fulfilled") {
          setSummary(summaryResult.value);
        }

        if (streakResult.status === "fulfilled") {
          setStreak(streakResult.value);
        }

        if (challengeResult.status === "fulfilled") {
          setDailyChallenge(challengeResult.value);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
    fetchDashboard();
  }, []);

  if (!profile || !dashboard) {
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
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Welcome, {profile.username}
          </h1>

          <p className="mt-2 text-gray-600 text-lg">
            Track your progress, improve your rating, and complete today's
            challenge.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Quizzes"
            value={dashboard.overall_stats.total_quizzes}
          />

          <StatCard
            title="Questions Solved"
            value={dashboard.overall_stats.questions_attempted}
          />

          <StatCard
            title="Accuracy"
            value={`${dashboard.overall_stats.accuracy}%`}
          />

          <StatCard
            title="Points"
            value={dashboard.overall_stats.total_points}
          />

          <StatCard
            title="Rating"
            value={dashboard.profile?.rating}
          />

          <StatCard
            title="Highest Rating"
            value={dashboard.profile?.highest_rating}
          />

          <StatCard
            title="Rank"
            value={`#${dashboard.rank}`}
          />

          <StatCard
            title="Average Accuracy"
            value={`${summary.average_accuracy}%`}
          />

          <StatCard
            title="Highest Score"
            value={summary.highest_score}
          />

          <StatCard
            title="Current Streak"
            value={streak.current_streak}
          />

          <StatCard
            title="Longest Streak"
            value={streak.longest_streak}
          />

          <StatCard
            title="Achievements"
            value={dashboard.total_unlocked}
          />

          <StatCard
            title="Completion"
            value={`${dashboard.completion_percentage}%`}
          />
        </div>

        {/* Daily Challenge */}
        <div className="mt-10">
          {dailyChallenge ? (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Today's Challenge
                  </h2>

                  <p className="text-gray-600 mb-5">
                    Complete today's challenge to earn rewards and keep your
                    streak alive.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                      {dailyChallenge.points} Points
                    </span>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                      +{dailyChallenge.rating_reward} Rating
                    </span>

                    <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 capitalize">
                      {dailyChallenge.difficulty}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/daily-challenge")}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
                >
                  Open Challenge
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">
                Today's Challenge
              </h2>

              <p className="text-gray-600">
                No daily challenge is available right now. Check back tomorrow
                for a new challenge.
              </p>
            </div>
          )}
        </div>

        {/* Recent Attempts */}
        {dashboard.recent_attempts?.length > 0 && (
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">
              Recent Attempts
            </h2>

            <div className="space-y-4">
              {dashboard.recent_attempts.slice(0, 5).map((attempt) => (
                <div
                  key={attempt.quiz_id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-colors duration-200 hover:bg-gray-100"
                >
                  <div className="grid grid-cols-3 items-center gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {attempt.subject}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-lg font-semibold text-blue-600">
                        {attempt.percentage}%
                      </p>
                      <p className="text-xs text-gray-500">
                        Accuracy
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">
                        {attempt.score}
                      </p>
                      <p className="text-xs text-gray-500">
                        Score
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Dashboard;