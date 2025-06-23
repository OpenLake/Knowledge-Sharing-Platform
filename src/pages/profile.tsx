import React, { useEffect, useState } from 'react';
import { ProfileData } from '../types/profileColumnData';
import { toast } from 'react-hot-toast';
import { updateProfile } from '../services/db/profile/updateProfile';
import { useAuth } from '../contexts/auth';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { getProfile } from '../services/db/profile/getProfile';
import { getUserCourses } from '../services/db/courses/getUserCourses';

const ProfilePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
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
      if (!user?.email) return;
      setProfileLoading(true);
      try {
        const storedProfile = localStorage.getItem("userProfile");
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile) as ProfileData;
          setProfile(parsedProfile);
          setFormData(parsedProfile);
          return;
        }

        const userProfile = await getProfile(user.email);
        
        if (userProfile) {
          setProfile(userProfile);
          setFormData(userProfile);
          localStorage.setItem("userProfile", JSON.stringify(userProfile));
        } else {
          const emptyProfile = {
            name: user.displayName || '',
            email: user.email || '',
            branch: '',
            college: '',
            bio: '',
            profileImage: user.photoURL || '/profile.jpeg'
          };
          setFormData(emptyProfile);
        }
        
        const enrolledCourses = await getUserCourses(user.email);
       setCourses(enrolledCourses || []);
      } catch (error) {
        toast.error("Failed to load profile");
        console.error("Profile fetch error:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user]);
          

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
  if (!formData.name || !formData.email) {
    toast.error('Name and email are required.');
    return;
  }

  if (!/\S+@\S+\.\S+/.test(formData.email)) {
    toast.error('Invalid email format.');
    return;
  }

  try {
    await updateProfile(formData);
    setProfile(formData);
    setEditMode(false);
    localStorage.setItem("userProfile", JSON.stringify(formData));
    toast.success("Profile updated successfully");
  } catch (err: any) {
    console.error("Update failed:", err);
    toast.error('Failed to update profile. Please try again.');
  }
};


  const handleCancel = () => {
    setEditMode(false);
    setFormData(profile!); 
  };
  
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-200 flex flex-col items-center pt-[140px]">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-200 flex flex-col items-center pt-[140px]">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        {profile && (
          <div className="flex flex-col items-center w-full sm:w-96 md:w-80 lg:w-96 mx-auto">
            <div className="relative">
   <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 shadow-md">
    <Image
      src={profile.profileImage || user?.photoURL || '/profile.jpeg'}
      alt="Profile"
      width={128}
      height={128}
      className="object-cover w-full h-full"
     />
    </div>

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
              <div className="flex flex-wrap gap-4 mt-3">
                {courses.length > 0 ? (
                  courses.map((course, idx) => (
                    <div
                      key={idx}
                      className="w-20 h-20 bg-purple-100 rounded-lg flex items-center justify-center text-xs text-center p-1 shadow"
                      title={course.title}
                    >
                      {course.title || course.code || 'Untitled'}
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No enrolled courses</span>
                )}
              </div>
            </div>
            <div className="mt-6 w-full space-y-2">
              <button className="bg-blue-200 w-full py-2 rounded-md mb-2 hover:bg-blue-300">
                🔗 Connections
              </button>
              <button
                className="bg-blue-200 w-full py-2 rounded-md mb-2 hover:bg-blue-300"
                onClick={() => router.push('/discussion')} 
              >
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
