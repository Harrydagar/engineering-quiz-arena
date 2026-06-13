import { useEffect, useState } from "react";
import { getLeaderboard } from "../services/quizService";
import MainLayout from "../layouts/MainLayout";
import LoadingSpinner from "../components/LoadingSpinner";



function LeaderboardPage() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setPlayers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
      <MainLayout>

        <div>
          <h1>Leaderboard</h1>

          {players.map((player) => (
            <div
              key={player.username}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
              }}
            >
              <h3>
                #{player.rank} {player.username}
              </h3>

              <p>Rating: {player.rating}</p>
              <p>
                Highest Rating: {player.highest_rating}
              </p>
            </div>
          ))}
        </div>
      </MainLayout>
            
  );
}

export default LeaderboardPage;