import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link> |{" "}
      <Link to="/subjects">Subjects</Link> |{" "}
      <Link to="/history">History</Link> |{" "}
      <Link to="/mistakes">Mistakes</Link> |{" "}
      <Link to="/leaderboard">Leaderboard</Link> |{" "}
      <Link to="/analytics">Analytics</Link> |{" "}
      <Link to="/achievements">Achievements</Link> |{" "}
      <Link to="/profile">Profile</Link> |{" "}
      <button onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;