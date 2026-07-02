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
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-4 flex-wrap">
        <div className="mr-6 text-xl font-bold tracking-tight text-white">
          QuizArena
        </div>

        <NavLink to="/dashboard" className={navClass}>
          Dashboard
        </NavLink>

        <NavLink to="/subjects" className={navClass}>
          Subjects
        </NavLink>

        <NavLink to="/daily-challenge" className={navClass}>
          Daily Challenge
        </NavLink>

        <NavLink to="/history" className={navClass}>
          History
        </NavLink>

        <NavLink to="/mistakes" className={navClass}>
          Mistakes
        </NavLink>

        <NavLink to="/leaderboard" className={navClass}>
          Leaderboard
        </NavLink>

        <NavLink to="/analytics" className={navClass}>
          Analytics
        </NavLink>

        <NavLink to="/achievements" className={navClass}>
          Achievements
        </NavLink>

        <NavLink to="/profile" className={navClass}>
          Profile
        </NavLink>

        <button
          onClick={handleLogout}
          className="ml-auto rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;