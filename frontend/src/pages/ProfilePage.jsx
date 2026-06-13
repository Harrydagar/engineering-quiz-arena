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
    return  <LoadingSpinner />;
  }

  return (
    <MainLayout>
      <div>
        <h1>Profile</h1>

        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email || "Not Provided"}</p>
        <p><strong>Rating:</strong> {profile.rating}</p>
        <p><strong>Highest Rating:</strong> {profile.highest_rating}</p>
        <p><strong>Current Streak:</strong> {profile.current_streak}</p>
        <p><strong>Longest Streak:</strong> {profile.longest_streak}</p>
      </div>
    </MainLayout>
    
  );
}

export default ProfilePage;