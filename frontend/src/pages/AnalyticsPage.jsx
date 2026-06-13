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
      <div>
        <h1>Analytics</h1>

        <p>Total Quizzes: {stats.total_quizzes}</p>

        <p>
          Questions Attempted:
          {stats.questions_attempted}
        </p>

        <p>
          Correct Answers:
          {stats.correct_answers}
        </p>

        <p>
          Wrong Answers:
          {stats.wrong_answers}
        </p>

        <p>
          Accuracy:
          {stats.accuracy}%
        </p>

        <p>
          Total Points:
          {stats.total_points}
        </p>
        <h2>Subject Performance</h2>

        {subjects.map((subject) => (
          <div
            key={subject.subject}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
            }}
          >
            <h3>{subject.subject}</h3>

            <p>
              Attempted: {subject.attempted}
            </p>

            <p>
              Correct: {subject.correct}
            </p>

            <p>
              Accuracy: {subject.accuracy}%
            </p>
          </div>
        ))}

        <h2>Recent Attempts</h2>

        {recentAttempts.map((attempt) => (
          <div
            key={attempt.quiz_id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
            }}
          >
            <h3>{attempt.subject}</h3>

            <p>Score: {attempt.score}</p>

            <p>
              Questions: {attempt.total_questions}
            </p>

            <p>
              Accuracy: {attempt.percentage}%
            </p>

            <p>
              Quiz ID: {attempt.quiz_id}
            </p>
          </div>
        ))}

        <h2>Difficulty Performance</h2>

        {difficultyStats && (
          <>
            <div>
              <h3>Easy</h3>
              <p>Attempted: {difficultyStats.easy.attempted}</p>
              <p>Correct: {difficultyStats.easy.correct}</p>
              <p>Accuracy: {difficultyStats.easy.accuracy}%</p>
            </div>

            <div>
              <h3>Medium</h3>
              <p>Attempted: {difficultyStats.medium.attempted}</p>
              <p>Correct: {difficultyStats.medium.correct}</p>
              <p>Accuracy: {difficultyStats.medium.accuracy}%</p>
            </div>

            <div>
              <h3>Hard</h3>
              <p>Attempted: {difficultyStats.hard.attempted}</p>
              <p>Correct: {difficultyStats.hard.correct}</p>
              <p>Accuracy: {difficultyStats.hard.accuracy}%</p>
            </div>
          </>
        )}

        <h2>Difficulty Recommendation</h2>

        {recommendation && (
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
            }}
          > 
            <h3>
              Recommended Level:
              {" "}
              {recommendation.recommended_level}
            </h3>

            <p>
              Medium Accuracy:
              {" "}
              {recommendation.medium_accuracy}%
            </p>

            <p>
              Hard Accuracy:
              {" "}
              {recommendation.hard_accuracy}%
            </p>  
          </div>
        )}
      </div>
    </MainLayout>
      
  );
}

export default AnalyticsPage;