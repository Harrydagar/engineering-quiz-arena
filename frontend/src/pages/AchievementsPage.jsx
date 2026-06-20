import { useEffect, useState } from "react";
import {
  getMyAchievements,
  getAchievementSummary,
} from "../services/quizService";
import MainLayout from "../layouts/MainLayout";
import LoadingSpinner from "../components/LoadingSpinner";

function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [summary, setSummary] = useState(null);



  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await getMyAchievements();
        setAchievements(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSummary = async () => {
        try {
            const data =
            await getAchievementSummary();

            setSummary(data);
        } catch (error) {
            console.error(error);
        }
    };

    fetchAchievements();
    fetchSummary();



  }, []);

  return (
    <MainLayout>
        <h1 className="text-4xl font-bold mb-8">
            My Achievements
        </h1>

        {summary && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                    Achievement Progress
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-gray-500">Unlocked</p>
                        <p className="text-2xl font-bold">
                            {summary.total_unlocked}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Available</p>
                        <p className="text-2xl font-bold">
                            {summary.total_available}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Remaining</p>
                        <p className="text-2xl font-bold">
                            {summary.remaining}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Completion</p>
                        <p className="text-2xl font-bold text-green-600">
                            {summary.completion_percentage}%
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                            <div
                                className="bg-green-500 h-3 rounded-full"
                                style={{
                                    width: `${summary.completion_percentage}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )}

        {summary?.recent_achievements?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">

                <h2 className="text-2xl font-semibold mb-4">
                    Recent Unlocks
                </h2>

                <div className="space-y-3">

                    {summary.recent_achievements.map(
                        (achievement) => (
                            <div
                                key={achievement.id}
                                className="border-b pb-2"
                            >
                                <p className="font-medium">
                                    {achievement.name}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {achievement.description}
                                </p>
                            </div>
                        )
                    )}

                </div>

            </div>
        )}

        
        {achievements.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6">
                <p>No achievements unlocked yet.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        className="bg-white rounded-xl shadow-md p-6"
                    >
                        <h3 className="text-xl font-bold mb-2">
                            {achievement.name}
                        </h3>

                        <p className="text-gray-600 mb-4">
                            {achievement.description}
                        </p>

                        <p className="text-sm text-gray-500">
                            Earned on{" "}
                            {new Date(
                                achievement.earned_at
                            ).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
         )}
    </MainLayout>
    );

}

export default AchievementsPage;