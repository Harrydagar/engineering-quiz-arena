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
      <h1 className="text-4xl font-bold mb-8">
        Leaderboard
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-4">
                Rank
              </th>

              <th className="text-left p-4">
                User
              </th>

              <th className="text-left p-4">
                Rating
              </th>

              <th className="text-left p-4">
                Highest Rating
              </th>
            </tr>
          </thead>

          <tbody>
            {players.map((player) => (
              <tr
                key={player.username}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4 font-bold">
                  #{player.rank}
                </td>

                <td className="p-4">
                  {player.username}
                </td>

                <td className="p-4">
                  {player.rating}
                </td>

                <td className="p-4">
                  {player.highest_rating}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}

export default LeaderboardPage;