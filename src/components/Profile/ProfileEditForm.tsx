import React, { useState } from 'react';
import { ProfileData } from '../../types/profileColumnData';

interface ProfileEditFormProps {
  userData: ProfileData;
  onSave: (updatedData: ProfileData) => void;
  onCancel: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ userData, onSave, onCancel }) => {
  const [updatedData, setUpdatedData] = useState<ProfileData>(userData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUpdatedData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex flex-col items-center">
      {/* Profile Picture */}
      <div className="relative">
        <img
          src={updatedData.profileImage}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-md"
        />
        <input
          type="text"
          name="profileImage"
          value={updatedData.profileImage || ''}
          onChange={handleChange}
          className="mt-2 w-full px-3 py-2 border rounded-md text-center"
          placeholder="Profile Image URL"
        />
      </div>

      {/* Profile Details */}
      <input
        type="text"
        name="name"
        value={updatedData.name || ''}
        onChange={handleChange}
        className="mt-4 w-full px-3 py-2 border rounded-md"
        placeholder="Student Name"
      />
      <input
        type="text"
        name="branch"
        value={updatedData.branch || ''}
        onChange={handleChange}
        className="mt-2 w-full px-3 py-2 border rounded-md"
        placeholder="Branch"
      />
      <input
        type="text"
        name="college"
        value={updatedData.college || ''}
        onChange={handleChange}
        className="mt-2 w-full px-3 py-2 border rounded-md"
        placeholder="College Name & Year"
      />

      {/* About Section */}
      <textarea
        name="bio"
        value={updatedData.bio || ''}
        onChange={handleChange}
        className="mt-4 w-full p-2 border rounded-md"
        placeholder="About me ..."
      />

      {/* Save & Cancel Buttons */}
      <div className="mt-4 flex justify-between w-full">
        <button
          onClick={() => onSave(updatedData)}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProfileEditForm;

