import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "../services/auth";
import MainLayout from "../layouts/MainLayout";
import LoadingSpinner from "../components/LoadingSpinner";

function ProfilePage() {
  const [profile, setProfile] =
    useState(null);

  useEffect(() => {
    const fetchProfile =
      async () => {
        try {
          const data =
            await getProfile();

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

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Profile
        </h1>

        <p className="text-gray-500 mt-2">
          Your learning statistics
          and progress.
        </p>

      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <p className="text-gray-500">
              Username
            </p>

            <p className="text-xl font-semibold">
              {profile.username}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Email
            </p>

            <p className="text-xl font-semibold">
              {profile.email ||
                "Not Provided"}
            </p>
          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            Rating
          </p>

          <p className="text-3xl font-bold text-blue-600">
            {profile.rating}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            Highest Rating
          </p>

          <p className="text-3xl font-bold text-green-600">
            {profile.highest_rating}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            Current Streak
          </p>

          <p className="text-3xl font-bold">
            {profile.current_streak}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            Longest Streak
          </p>

          <p className="text-3xl font-bold">
            {profile.longest_streak}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            Total Quizzes
          </p>

          <p className="text-3xl font-bold">
            {profile.total_quizzes ?? 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">
            Total Correct
          </p>

          <p className="text-3xl font-bold">
            {profile.total_correct ?? 0}
          </p>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mt-8">

        <h2 className="text-2xl font-bold mb-6">
          Account Security
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">

          <Link
            to="/change-password"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-center"
          >
            Change Password
          </Link>

          <Link
            to="/resend-verification"
            className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 text-center"
          >
            Resend Verification Email
          </Link>

        </div>

      </div>

    </MainLayout>
  );
}

export default ProfilePage;