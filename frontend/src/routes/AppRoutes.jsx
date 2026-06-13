import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopicsPage from "../pages/TopicsPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import SubjectsPage from "../pages/SubjectsPage";
import ProtectedRoute from "./ProtectedRoute";
import StartQuizPage from "../pages/StartQuizPage";
import QuizPage from "../pages/QuizPage";
import ResultsPage from "../pages/ResultsPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import AchievementsPage from "../pages/AchievementsPage";



function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <SubjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects/:subjectId"
          element={
            <ProtectedRoute>
              <TopicsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/start-quiz"
          element={
            <ProtectedRoute>
              <StartQuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:attemptId"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects"
          element={<SubjectsPage />}
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <AchievementsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;