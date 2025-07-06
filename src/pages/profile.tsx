import React, { useEffect, useState } from 'react';
import { ProfileData } from '../types/profileColumnData';
import { toast } from 'react-hot-toast';
import { updateProfile } from '../services/db/profile/updateProfile';
import { useAuth } from '../contexts/auth';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { getProfile } from '../services/db/profile/getProfile';
import { getUserCourses } from '../services/db/courses/getUserCourses';
import { ConnectionsModal } from '../components/Profile/ConnectionsModal';
import { addConnection } from '../services/db/profile/addConnection';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../utils/firebaseInit';
import dynamic from 'next/dynamic';
const ProfileModal = dynamic(() => import('../components/Profile/ProfileModal'), { ssr: false });

const ProfilePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [showConnections, setShowConnections] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

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
      const loggedInEmail = user?.email;
      if (!loggedInEmail) return;

      setProfileLoading(true);

      try {
       const targetEmail = typeof router.query.email === 'string' ? router.query.email : loggedInEmail;

        const userProfile = await getProfile(targetEmail);
        if (userProfile) {
          setProfile(userProfile);
          setFormData(userProfile);
        }

        const enrolledCourses = await getUserCourses(targetEmail);
        setCourses(enrolledCourses || []);

        if (
          userProfile &&
          userProfile.email !== loggedInEmail
        ) {
          const ref = doc(
            firestore,
            'connections',
            loggedInEmail,
            'userConnections',
            userProfile.email
          );
          const snapshot = await getDoc(ref);
          setIsConnected(snapshot.exists());
        }
      } catch (error) {
        toast.error('Failed to load profile');
        console.error('Profile fetch error:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user, router.query.email]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      localStorage.setItem('userProfile', JSON.stringify(formData));
      toast.success('Profile updated successfully');
    } catch (err: any) {
      console.error('Update failed:', err);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData(profile!);
  };

  const handleConnect = async () => {
    if (!user || !profile) return;

    const currentEmail = user.email?.toLowerCase().trim();
    const profileEmail = profile.email?.toLowerCase().trim();

    if (currentEmail === profileEmail) {
      toast.error('You cannot connect with yourself.');
      return;
    }

    try {
      const success = await addConnection(
        {
          name: user.displayName || '',
          email: currentEmail || '',
          profileImage: user.photoURL || '/profile.jpeg',
          branch: '',
          college: '',
          bio: '',
        },
        profile
      );

      if (success) {
        toast.success('Connected successfully');
        setIsConnected(true);
      } else {
        toast.error('Connection failed or already exists.');
      }
    } catch (err) {
      console.error('Connection error:', err);
      toast.error('Something went wrong while connecting.');
    }
  };
  
  const handleDisconnect = async () => {
  if (!user || !profile) return;

  const currentEmail = user.email?.toLowerCase().trim();
  const profileEmail = profile.email?.toLowerCase().trim();

  try {
    const ref1 = doc(firestore, 'connections', currentEmail!, 'userConnections', profileEmail!);
    const ref2 = doc(firestore, 'connections', profileEmail!, 'userConnections', currentEmail!);

    await Promise.all([deleteDoc(ref1), deleteDoc(ref2)]);
    setIsConnected(false);
   toast(
  'Disconnected successfully',
  {
    duration: 3000,
    position: 'top-center',
    style: {
      background: 'white',
      color: '#dc2626', 
      fontWeight: '500',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    },
  }
);

  } catch (err) {
    console.error('Disconnect error:', err);
    toast.error('Failed to disconnect.');
  }
};

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-200 flex flex-col items-center pt-[170px]">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center">
          Loading profile...
        </div>
      </div>
    );
  }

  const isOwnProfile =
    user?.email?.toLowerCase().trim() ===
    profile?.email?.toLowerCase().trim();

 return (
    <ProfileModal onClose={() => router.back()}>
      {showConnections && user?.email && (
        <ConnectionsModal
          userEmail={profile?.email || user.email}
          onClose={() => setShowConnections(false)}
        />
      )}
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        {profile && (
          <div className="flex flex-col items-center w-full mx-auto">
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

              {isOwnProfile && (
                <button
                  onClick={() => setEditMode(true)}
                  className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md"
                >
                  ✏️
                </button>
              )}
            </div>

            {editMode ? (
              // ✏️ Editable Form
              <div className="mt-6 w-full">
                {['name', 'email', 'branch', 'college'].map((field) => (
                  <input
                    key={field}
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={(formData as any)[field]}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md mb-2"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  />
                ))}
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
              // 👁️ Read-only Display
              <div className="mt-6 flex flex-col items-center">
                <span className="bg-purple-200 px-4 py-1 rounded-full text-sm">
                  {profile.name}
                </span>
                <span className="bg-purple-200 px-4 py-1 mt-2 rounded-full text-sm">
                  {profile.branch}
                </span>
                <span className="bg-purple-200 px-4 py-1 mt-2 rounded-full text-sm">
                  {profile.college}
                </span>
                <div className="mt-4 w-full">
                  <textarea
                    className="w-full h-32 p-3 border rounded-md text-base"
                    value={profile.bio}
                    readOnly
                  />
                </div>
              </div>
            )}

            {!isOwnProfile && (
  isConnected ? (
    <div className="mt-4 flex flex-col items-center space-y-2">
      <div className="text-green-600 font-semibold">✅ Connected</div>
      <button
  onClick={handleDisconnect}
  className="mt-4 border border-red-500 text-red-500 px-2 py-1.5 rounded-md hover:bg-red-50 transition-colors"
>
  Disconnect
</button>

    </div>
  ) : (
    <button
      onClick={handleConnect}
      className="mt-4 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
    >
      Connect
    </button>
  )
)}

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
                  <span className="text-sm text-gray-500">
                    No enrolled courses
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 w-full space-y-2">
              <button
                onClick={() => setShowConnections(true)}
                className="bg-blue-200 w-full py-2 rounded-md mb-2 hover:bg-blue-300"
              >
                🔗 Connections
              </button>
              <button
                className="bg-blue-200 w-full py-2 rounded-md mb-2 hover:bg-blue-300"
                onClick={() => router.push('/discussion')}
              >
                💬 Go to Discussion Page
              </button>
            </div>
          </div>
        )}
      </div>
    </ProfileModal>
    
  );

};
export default ProfilePage;

