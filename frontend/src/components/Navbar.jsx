import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        padding: "15px",
        borderBottom: "1px solid #ccc",
        marginBottom: "20px",
      }}
    >
      <h2>Quiz Arena</h2>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "10px",
        }}
      >
        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/subjects">
          Subjects
        </Link>

        <Link to="/leaderboard">
          Leaderboard
        </Link>

        <Link to="/analytics">
          Analytics
        </Link>

        <Link to="/achievements">
          Achievements
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;