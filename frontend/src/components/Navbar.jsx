import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    isActive
      ? "text-blue-400 font-semibold"
      : "hover:text-blue-400 transition";

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6 flex-wrap">

        <NavLink
          to="/dashboard"
          className={navClass}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/subjects"
          className={navClass}
        >
          Subjects
        </NavLink>

        <NavLink
          to="/daily-challenge"
          className={navClass}
        >
          Daily Challenge
        </NavLink>

        <NavLink
          to="/history"
          className={navClass}
        >
          History
        </NavLink>

        <NavLink
          to="/mistakes"
          className={navClass}
        >
          Mistakes
        </NavLink>

        <NavLink
          to="/leaderboard"
          className={navClass}
        >
          Leaderboard
        </NavLink>

        <NavLink
          to="/analytics"
          className={navClass}
        >
          Analytics
        </NavLink>

        <NavLink
          to="/achievements"
          className={navClass}
        >
          Achievements
        </NavLink>

        <NavLink
          to="/profile"
          className={navClass}
        >
          Profile
        </NavLink>

        <button
          onClick={handleLogout}
          className="ml-auto bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;