import { useEffect, useState } from "react";
import { getProfile } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";

function Dashboard() {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Navbar />

      <h1>Dashboard</h1>

      <StatCard
        title="Total Quizzes"
        value="0"
      />

      <StatCard
        title="Accuracy"
        value="0%"
      />

      <StatCard
        title="Rating"
        value="1000"
      />

      <StatCard
        title="Rank"
        value="#0"
      />
    </>
  );
}

export default Dashboard;