import { useEffect, useState } from "react";
import { getLeaderboard } from "../services/quizService";
import MainLayout from "../layouts/MainLayout";
import LoadingSpinner from "../components/LoadingSpinner";

function LeaderboardPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setPlayers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Leaderboard
          </h1>

          <p className="mt-2 text-gray-600">
            See how you rank against other Quiz Arena players.
          </p>
        </div>

        {/* Top 3 */}
        {players.length >= 3 && (
          <div className="grid gap-5 md:grid-cols-3 mb-10">

            {/* 2nd */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center">
              <div className="text-4xl mb-3">🥈</div>

              <h2 className="text-xl font-bold">
                {players[1].username}
              </h2>

              <p className="mt-2 text-gray-500">
                Rating
              </p>

              <p className="text-3xl font-bold text-gray-900">
                {players[1].rating}
              </p>
            </div>

            {/* 1st */}
            <div className="rounded-2xl border-2 border-yellow-400 bg-yellow-50 p-8 shadow-md text-center">
              <div className="text-5xl mb-3">🏆</div>

              <h2 className="text-2xl font-bold">
                {players[0].username}
              </h2>

              <p className="mt-2 text-gray-600">
                Rating
              </p>

              <p className="text-4xl font-bold text-yellow-600">
                {players[0].rating}
              </p>
            </div>

            {/* 3rd */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center">
              <div className="text-4xl mb-3">🥉</div>

              <h2 className="text-xl font-bold">
                {players[2].username}
              </h2>

              <p className="mt-2 text-gray-500">
                Rating
              </p>

              <p className="text-3xl font-bold text-gray-900">
                {players[2].rating}
              </p>
            </div>

          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">

          <table className="min-w-full">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Rank
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  User
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Rating
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Highest Rating
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Streak
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Achievements
                </th>
              </tr>
            </thead>

            <tbody>
              {players.map((player) => (
                <tr
                  key={player.username}
                  className="border-t border-gray-200 transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-bold">
                    #{player.rank}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {player.username}
                  </td>

                  <td className="px-6 py-4 font-semibold text-blue-600">
                    {player.rating}
                  </td>

                  <td className="px-6 py-4">
                    {player.highest_rating}
                  </td>

                  <td className="px-6 py-4">
                    🔥 {player.current_streak}
                  </td>

                  <td className="px-6 py-4">
                    🏅 {player.achievement_count}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </MainLayout>
  );
}

export default LeaderboardPage;