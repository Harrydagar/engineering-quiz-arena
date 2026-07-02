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
import HistoryPage from "../pages/HistoryPage";
import QuizReviewPage from "../pages/QuizReviewPage";
import MistakeTrackerPage from "../pages/MistakeTrackerPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";
import DailyChallengePage from "../pages/DailyChallengePage";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";
import ResendVerification from "../pages/ResendVerification";
import ChangePassword from "../pages/ChangePassword";



function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
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
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/:attemptId"
          element={
            <ProtectedRoute>
              <QuizReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mistakes"
          element={
            <ProtectedRoute>
              <MistakeTrackerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
          }
        />

        <Route 
        path="*" 
        element={<NotFoundPage />} 
        />
        
        <Route
          path="/daily-challenge"
          element={<DailyChallengePage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:uidb64/:token"
          element={<ResetPassword />}
        />

        <Route
          path="/verify-email/:uidb64/:token"
          element={<VerifyEmail />}
        />

        <Route
          path="/resend-verification"
          element={<ResendVerification />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;