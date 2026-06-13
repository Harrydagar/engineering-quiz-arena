import { useEffect, useState } from "react";
import { getProfile } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import { getDashboard } from "../services/quizService";


function Dashboard() {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
        const data = await getDashboard();
        console.log("DASHBOARD:", data);
        setDashboard(data);
      } catch (error) {
        console.log("DASHBOARD ERROR:", error);
      }
    };

    fetchProfile();
    fetchDashboard();
  }, []);

  if (!profile || !dashboard) {
   return <h1>Loading...</h1>;
  }

  return (
    <>
      <Navbar />

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
    </>
  );
}

export default Dashboard;