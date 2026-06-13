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
        <div>
            <h1>My Achievements</h1>

            {summary && (
                <div>
                    <h2>Achievement Progress</h2>

                    <p>Unlocked: {summary.total_unlocked}</p>
                    <p>Available: {summary.total_available}</p>
                    <p>Remaining: {summary.remaining}</p>
                    <p>
                    Completion:
                        {summary.completion_percentage}%
                    </p>
                </div>
            )}

            {achievements.length === 0 ? (
                <p>No achievements unlocked yet.</p>
            ) : (
                achievements.map((achievement) => (
                    <div key={achievement.id}>
                    <h3>{achievement.name}</h3>

                    <p>{achievement.description}</p>

                    <p>
                        Earned:
                        {new Date(
                        achievement.earned_at
                        ).toLocaleDateString()}
                    </p>
                </div>
            ))
            )}
        </div>
    </MainLayout>    
    
);

}

export default AchievementsPage;