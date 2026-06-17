import { useEffect, useState } from "react";
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
      <h1 className="text-4xl font-bold mb-8">
        Profile
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-8">
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
              {profile.email || "Not Provided"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Rating
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {profile.rating}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Highest Rating
            </p>
            <p className="text-2xl font-bold text-green-600">
              {profile.highest_rating}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Current Streak
            </p>
            <p className="text-2xl font-bold">
              {profile.current_streak}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Longest Streak
            </p>
            <p className="text-2xl font-bold">
              {profile.longest_streak}
            </p>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default ProfilePage;