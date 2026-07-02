import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "../services/auth";
import MainLayout from "../layouts/MainLayout";
import LoadingSpinner from "../components/LoadingSpinner";

function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Profile
          </h1>

          <p className="mt-2 text-lg text-gray-600">
            View your account details, ratings and learning progress.
          </p>
        </div>

        {/* User Card */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center gap-6 md:flex-row">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-700">
              {profile.username.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {profile.username}
              </h2>

              <p className="mt-2 text-gray-600">
                {profile.email || "Email not provided"}
              </p>
            </div>

          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-gray-500">Rating</p>

            <h2 className="mt-3 text-3xl font-bold text-blue-600">
              {profile.rating}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-gray-500">Highest Rating</p>

            <h2 className="mt-3 text-3xl font-bold text-green-600">
              {profile.highest_rating}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-gray-500">Current Streak</p>

            <h2 className="mt-3 text-3xl font-bold">
              🔥 {profile.current_streak}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-gray-500">Longest Streak</p>

            <h2 className="mt-3 text-3xl font-bold">
              {profile.longest_streak}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-gray-500">Total Quizzes</p>

            <h2 className="mt-3 text-3xl font-bold">
              {profile.total_quizzes ?? 0}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-gray-500">Total Correct</p>

            <h2 className="mt-3 text-3xl font-bold">
              {profile.total_correct ?? 0}
            </h2>
          </div>

        </div>

        {/* Account Security */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

          <h2 className="mb-6 text-2xl font-semibold text-gray-900">
            Account Security
          </h2>

          <div className="flex flex-col gap-4 sm:flex-row">

            <Link
              to="/change-password"
              className="rounded-lg bg-blue-600 px-6 py-3 text-center font-medium text-white transition-colors duration-200 hover:bg-blue-700"
            >
              Change Password
            </Link>

            <Link
              to="/resend-verification"
              className="rounded-lg border border-gray-300 px-6 py-3 text-center font-medium transition-colors duration-200 hover:bg-gray-100"
            >
              Resend Verification Email
            </Link>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default ProfilePage;