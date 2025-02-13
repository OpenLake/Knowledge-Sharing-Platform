import React, { useEffect, useState } from 'react';
import { ProfileData } from '../types/profileColumnData';
import { toast } from 'react-hot-toast';
import { updateProfile } from '../services/db/profile/updateProfile';
import { useAuth } from '../contexts/auth';
import { firestore } from '../utils/firebaseInit';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    email: '',
    branch: '',
    college: '',
    bio: '',
    profileImage: '',
  });

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const storedProfile = localStorage.getItem("userProfile");

      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
        setFormData(JSON.parse(storedProfile));
      } else {
        const userEmail = "john.doe@example.com"; 
        const profilesCollection = collection(firestore, "profiles");
        const q = query(profilesCollection, where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userProfile = querySnapshot.docs[0].data() as ProfileData;
          setProfile(userProfile);
          setFormData(userProfile);

          localStorage.setItem("userProfile", JSON.stringify(userProfile));
        } else {
          console.warn("Profile not found for email:", userEmail);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  fetchProfile();
}, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setProfile(formData);
      setEditMode(false);
      localStorage.setItem("userProfile", JSON.stringify(formData));
    } catch (err) {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData(profile!); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-200 flex flex-col items-center mt-[140px]">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        {profile && (
          <div className="flex flex-col items-center w-full sm:w-96 md:w-80 lg:w-96 mx-auto">
            <div className="relative">
              <img
                src={profile.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-md"
              />
              <button
                onClick={() => setEditMode(true)}
                className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md"
              >
                ✏️
              </button>
            </div>
 
            {editMode ? (
              <div className="mt-6 w-full">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md mb-2"
                  placeholder="Name"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md mb-2"
                  placeholder="Email"
                />
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md mb-2"
                  placeholder="Branch"
                />
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md mb-2"
                  placeholder="College"
                />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md mb-2"
                  placeholder="About me ..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center">
                <span className="bg-purple-200 px-4 py-1 rounded-full text-sm">{profile.name}</span>
                <span className="bg-purple-200 px-4 py-1 mt-2 rounded-full text-sm">{profile.branch}</span>
                <span className="bg-purple-200 px-4 py-1 mt-2 rounded-full text-sm">{profile.college}</span>
                <div className="mt-4 w-full">
                  <textarea
                    className="w-full h-32 p-3 border rounded-md text-base"
                    value={profile.bio}
                    readOnly
                  />
                </div>
              </div>
            )}
            <button className="mt-4 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600">
              Connect
            </button>
            <div className="mt-6 w-full">
              <h2 className="text-lg font-bold">📑 My Courses</h2>
              <div className="flex justify-between mt-3 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-purple-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="mt-6 w-full space-y-2">
              <button className="bg-blue-200 w-full py-2 rounded-md mb-2 hover:bg-blue-300">
                🔗 Connections
              </button>
              <button className="bg-blue-200 w-full py-2 rounded-md mb-2 hover:bg-blue-300">
                💬 Go to Discussion Page
              </button>
              <button className="bg-gray-500 text-white w-full py-2 rounded-md hover:bg-gray-600">
                ⚙️ Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
