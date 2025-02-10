import React, { useEffect, useState } from 'react';
import ProfileCard from '../components/Profile/ProfileCard';
import ProfileEditForm from '../components/Profile/ProfileEditForm';
import { ProfileData } from '../types/profileColumnData';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = {
        id: '12345',
        name: 'John Doe',
        branch: 'Computer Science',
        college: 'ABC University, 3rd Year',
        bio: 'About me ...',
        profileImage: '/path/to/avatar.jpg',
      };
      setProfile(profileData);
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => setEditMode(true);
  const handleSave = (updatedData: ProfileData) => {
    setProfile(updatedData);
    setEditMode(false);
  };
  const handleCancel = () => setEditMode(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-200 flex flex-col items-center mt-[140px]">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        {profile && (
          editMode ? (
            <ProfileEditForm userData={profile} onSave={handleSave} onCancel={handleCancel} />
          ) : (
            <ProfileCard userData={profile} onEditClick={handleEditClick} />
          )
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

