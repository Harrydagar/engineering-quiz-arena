import { useEffect, useState } from "react";
import { getProfile } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import {
  getDashboard,
  getPerformanceSummary,
  getUserStreak,
} from "../services/quizService";
import MainLayout from "../layouts/MainLayout";
import LoadingSpinner from "../components/LoadingSpinner";


function Dashboard() {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [summary, setSummary] = useState({
    total_quizzes: 0,
    average_accuracy: 0,
    highest_score: 0,
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [streak, setStreak] = useState({
    current_streak: 0,
    longest_streak: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        console.log("PROFILE:", data);
        setProfile(data);
      } catch (error) {
        console.log("PROFILE ERROR:", error);
      }
    };

    const fetchDashboard = async () => {
      try {
        const [
          dashboardResult,
          summaryResult,
          streakResult,
        ] = await Promise.allSettled([
          getDashboard(),
          getPerformanceSummary(),
          getUserStreak(),
        ]);

        if (dashboardResult.status === "fulfilled") {
          setDashboard(dashboardResult.value);
        }

        if (summaryResult.status === "fulfilled") {
          setSummary(summaryResult.value);
        } else {
          console.error(
            "Summary Error:",
            summaryResult.reason
          );
        }

        if (streakResult.status === "fulfilled") {
          setStreak(streakResult.value);
        } else {
          console.error(
            "Streak Error:",
            streakResult.reason
          );
        }
      } catch (error) {
        console.error("Dashboard Error:", error);
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

      <h1>Dashboard</h1>

      <StatCard
        title="Total Quizzes"
        value={dashboard.overall_stats.total_quizzes}
      />

      <StatCard
        title="Accuracy"
        value={`${dashboard.overall_stats.accuracy}%`}
      />

      <StatCard
        title="Rating"
        value={dashboard.rating}
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

      <button onClick={handleLogout}>
        Logout
      </button>
    </MainLayout>
  );
}

export default Dashboard;