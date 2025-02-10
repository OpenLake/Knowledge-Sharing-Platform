import React from 'react';
import { ProfileData } from '../../types/profileColumnData';

interface ProfileCardProps {
  userData: ProfileData;
  onEditClick: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ userData, onEditClick }) => {
  return (
    <div className="flex flex-col items-center w-full sm:w-96 md:w-80 lg:w-96 mx-auto">
      {/* Profile Picture */}
      <div className="relative">
        <img
          src={userData.profileImage}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-md"
        />
        <button
          onClick={onEditClick}
          className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md"
        >
          ✏️
        </button>
      </div>

      {/* Profile Details */}
      <div className="mt-6 flex flex-col items-center">
        <span className="bg-purple-200 px-4 py-1 rounded-full text-sm">{userData.name}</span>
        <span className="bg-purple-200 px-4 py-1 mt-2 rounded-full text-sm">{userData.branch}</span>
        <span className="bg-purple-200 px-4 py-1 mt-2 rounded-full text-sm">{userData.college}</span>
      </div>

      {/* About Section */}
<div className="mt-4 w-full max-w-2xl mx-auto transition-all duration-300 ease-in-out hover:shadow-lg p-4">
  <textarea
    className="w-full h-32 p-3 border rounded-md text-base transition-all duration-300 ease-in-out focus:ring-2 focus:ring-purple-300"
    value={userData.bio}
    readOnly
  />
</div>


      {/* Connect Button */}
      <button className="mt-4 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300 ease-in-out transform hover:scale-105">
        Connect
      </button>

      {/* My Courses */}
      <div className="mt-6 w-full">
        <h2 className="text-lg font-bold">📑 My Courses</h2>
        <div className="flex justify-between mt-3 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-20 h-20 bg-purple-200 rounded-lg transition duration-300 ease-in-out hover:scale-105"></div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 w-full space-y-2">
        {/* Connections Button */}
        <button className="bg-blue-200 w-full py-2 rounded-md mb-2 hover:bg-blue-300 transition duration-300 ease-in-out transform hover:scale-105">
          🔗 Connections
        </button>
        {/* Discussion Button */}
        <button className="bg-blue-200 w-full py-2 rounded-md mb-2 hover:bg-blue-300 transition duration-300 ease-in-out transform hover:scale-105">
          💬 Go to Discussion Page
        </button>
        {/* Settings Button */}
        <button className="bg-gray-500 text-white w-full py-2 rounded-md hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105">
          ⚙️ Settings
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;

