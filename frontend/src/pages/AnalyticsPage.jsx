import { useEffect, useState } from "react";
import {
  getStats,
  getSubjectAnalytics,
  getRecentAttempts,
  getDifficultyStats,
  getDifficultyRecommendation,
} from "../services/quizService";
import MainLayout from "../layouts/MainLayout";
import LoadingSpinner from "../components/LoadingSpinner";



function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [difficultyStats, setDifficultyStats] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSubjects = async () => {
      try {
        const data = await getSubjectAnalytics();
        setSubjects(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRecentAttempts = async () => {
      try {
        const data = await getRecentAttempts();
        setRecentAttempts(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDifficultyStats = async () => {
      try {
        const data = await getDifficultyStats();
        setDifficultyStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRecommendation = async () => {
      try {
        const data =
          await getDifficultyRecommendation();

        setRecommendation(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
    fetchSubjects();
    fetchRecentAttempts();
    fetchDifficultyStats();
    fetchRecommendation();
  
  
  }, []);

  if (!stats) {
    return  <LoadingSpinner />;
  }

  return (
    <MainLayout>
      <h1 className="text-4xl font-bold mb-8">
        Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Quizzes</p>
          <h2 className="text-3xl font-bold">
            {stats.total_quizzes}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Accuracy</p>
          <h2 className="text-3xl font-bold">
            {stats.accuracy}%
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Points</p>
          <h2 className="text-3xl font-bold">
            {stats.total_points}
          </h2>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">
        Subject Performance
      </h2>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {subjects.map((subject) => (
          <div
            key={subject.subject}
            className="bg-white p-5 rounded-xl shadow"
          >
            <h3 className="font-bold text-lg">
              {subject.subject}
            </h3>

            <p>Attempted: {subject.attempted}</p>
            <p>Correct: {subject.correct}</p>
            <p>Accuracy: {subject.accuracy}%</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">
        Difficulty Performance
      </h2>

      {difficultyStats && (
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {["easy", "medium", "hard"].map((level) => (
            <div
              key={level}
              className="bg-white p-5 rounded-xl shadow"
            >
              <h3 className="font-bold capitalize">
                {level}
              </h3>

              <p>
                Attempted:
                {difficultyStats[level].attempted}
              </p>

              <p>
                Correct:
                {difficultyStats[level].correct}
              </p>

              <p>
                Accuracy:
                {difficultyStats[level].accuracy}%
              </p>
            </div>
          ))}
        </div>
      )}

      {recommendation && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-2">
            Recommended Difficulty
          </h2>

          <p className="text-lg">
            {recommendation.recommended_level}
          </p>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">
        Recent Attempts
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {recentAttempts.map((attempt) => (
          <div
            key={attempt.quiz_id}
            className="bg-white p-5 rounded-xl shadow"
          >
            <h3 className="font-bold">
              {attempt.subject}
            </h3>

            <p>Score: {attempt.score}</p>

            <p>
              Accuracy:
              {attempt.percentage}%
            </p>

            <p>
              Questions:
              {attempt.total_questions}
            </p>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

export default AnalyticsPage;