import { createContext, useContext, useEffect, useState } from 'react';
import cookies from 'js-cookie';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { api } from '../utils/api';
import { FirebaseError } from 'firebase/app';
import { firebaseAuth } from '../utils/firebaseInit';
import { User as FirebaseUser } from "firebase/auth";
import { getIdToken } from "firebase/auth";

type User = {
  id: string;
  email: string | null;
  name?: string | null;
  picture?: string | null;
};

const AuthContext = createContext({
  isAuthenticated: false,
  user:null,
  photoURL: '',
  displayName: '',
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [photoURL, setPhotoURL] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);

  // Functions
  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      cookies.remove('accessToken');
      setUser(null);
      setPhotoURL('');
      setDisplayName('');
      delete api.defaults.headers.Authorization;
    } catch (err) {
      toast.error((err as FirebaseError).message);
    }
  };

  const login = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const res = await signInWithPopup(firebaseAuth, provider);
      const { user }: any = res;
      const { accessToken } = user;

      if (accessToken) {
        cookies.set('accessToken', accessToken, { expires: 60 });

        api.defaults.headers.Authorization = `Bearer ${accessToken}`;
        const { data } = await api.get('/api/auth/');
        const { result: userData } = data;
        const { picture, name, isAdmin } = userData;

        if (userData) {
          setUser(userData);
          setPhotoURL(picture);
          setDisplayName(name);
          return isAdmin
        }
        toast.success('Login Successful');
      }
    } catch (err) {
      toast.error((err as FirebaseError).message);
    }
  };

  async function loadUserFromCookie() {
    const accessToken = cookies.get('accessToken');
    if (accessToken) {
      api.defaults.headers.Authorization = `Bearer ${accessToken}`;
      try {
        const { data } = await api.get('/api/auth/');
        const { result: user } = data;
        if (user) {
          setUser(user);
          setPhotoURL(user.picture);
          setDisplayName(user.name);
          return;
        }
      } catch (err) {
        if ((err as FirebaseError).code === 'auth/id-token-expired') {
          cookies.remove('accessToken');
          setUser(null);
          delete api.defaults.headers.Authorization;
        }
      }
    }
    const authUser = firebaseAuth.currentUser;
    if (authUser) {
      setUser({
        id: authUser.uid,
        email: authUser.email,
        name: authUser.displayName,
        picture: authUser.photoURL,
      });
      setPhotoURL(authUser.photoURL || '');
      setDisplayName(authUser.displayName || '');
      cookies.set('accessToken', authUser.accessToken || '', { expires: 60 });
    } else {
      setUser(null);
    }
    setLoading(false);
  }

  // Effects
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (authUser: FirebaseUser | null) => {  // ✅ Use firebaseAuth
      if (authUser) {
        const token = await authUser.getIdToken();
  
        setUser({
          id: authUser.uid,
          email: authUser.email,
          name: authUser.displayName,
          picture: authUser.photoURL,
        });
  
        setPhotoURL(authUser.photoURL || '');
        setDisplayName(authUser.displayName || '');

        cookies.set('accessToken', token, { expires: 60 });
      } else {
        loadUserFromCookie();
      }
    });
  
    return () => unsubscribe();
  }, []);  

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        photoURL,
        displayName,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return authContext as {
    isAuthenticated: boolean;
    user: User | null; // Use the defined User type
    photoURL: string;
    displayName: string;
    login: () => void;
    logout: () => void;
    loading: boolean;
  };
};



export const ProtectRoute = ({ children }: any) => {
    const router = useRouter();
  const { isAuthenticated, loading }: any = useAuth();

  if (loading || (!isAuthenticated && router.pathname !== '/login')) {
    return <h1>Loading...</h1>;
  }
  return children;
};
