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
  const [dailyChallenge, setDailyChallenge] =
    useState(null);

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
          setDashboard(
            dashboardResult.value
          );
        }

        if (summaryResult.status === "fulfilled") {
          setSummary(
            summaryResult.value
          );
        }

        if (streakResult.status === "fulfilled") {
          setStreak(
            streakResult.value
          );
        }

        if (challengeResult.status === "fulfilled") {
          setDailyChallenge(
            challengeResult.value
          );
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

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Welcome, {profile.username}
        </h1>

        <p className="text-gray-500 mt-2">
          Ready to improve your rating today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Total Quizzes"
          value={
            dashboard.overall_stats
              .total_quizzes
          }
        />

        <StatCard
          title="Questions Solved"
          value={
            dashboard.overall_stats
              .questions_attempted
          }
        />

        <StatCard
          title="Accuracy"
          value={`${dashboard.overall_stats.accuracy}%`}
        />

        <StatCard
          title="Points"
          value={
            dashboard.overall_stats
              .total_points
          }
        />

        <StatCard
          title="Rating"
          value={
            dashboard.profile?.rating
          }
        />

        <StatCard
          title="Highest Rating"
          value={
            dashboard.profile
              ?.highest_rating
          }
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
          value={
            dashboard.total_unlocked
          }
        />

        <StatCard
          title="Completion"
          value={`${dashboard.completion_percentage}%`}
        />

      </div>

      {dailyChallenge ? (
        <div className="mt-8 bg-white rounded-xl shadow-md border p-6">

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

            <div>

              <h2 className="text-2xl font-bold mb-2">
                Today's Challenge
              </h2>

              <p className="text-gray-600 mb-4">
                Complete today's challenge
                to earn rewards and keep
                your streak alive.
              </p>

              <div className="flex flex-wrap gap-2">

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {dailyChallenge.points}
                  {" "}
                  Points
                </span>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  +
                  {
                    dailyChallenge.rating_reward
                  }
                  {" "}
                  Rating
                </span>

                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm capitalize">
                  {
                    dailyChallenge.difficulty
                  }
                </span>

              </div>

            </div>

            <button
              onClick={() =>
                navigate(
                  "/daily-challenge"
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium"
            >
              Open Challenge
            </button>

          </div>

        </div>
      ) : (
        <div className="mt-8 bg-white rounded-xl shadow-md border p-6">
          <p>
            No challenge available
            today.
          </p>
        </div>
      )}

      {dashboard.recent_attempts?.length >
        0 && (
        <div className="mt-8 bg-white rounded-xl shadow-md border p-6">

          <h2 className="text-2xl font-bold mb-4">
            Recent Attempts
          </h2>

          <div className="space-y-3">

            {dashboard.recent_attempts
              .slice(0, 5)
              .map((attempt) => (
                <div
                  key={attempt.quiz_id}
                  className="bg-gray-50 border rounded-lg p-4"
                >

                  <div className="grid grid-cols-3 items-center">

                    <div>
                      <p className="font-semibold">
                        {attempt.subject}
                      </p>
                    </div>

                      <div className="text-center">
                        <p className="font-semibold">
                          {attempt.percentage}%
                        </p>
                        <p className="text-xs text-gray-500">
                          Accuracy
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">
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

    </MainLayout>
  );
}

export default Dashboard;