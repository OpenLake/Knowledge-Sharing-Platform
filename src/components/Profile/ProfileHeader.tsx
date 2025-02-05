import React from 'react';
import ProfileHeader from './ProfileHeader';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-200 flex flex-col items-center pt-[100px]">
      <ProfileHeader />
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        {/* Profile content goes here */}
      </div>
    </div>
  );
};

export default ProfilePage;

