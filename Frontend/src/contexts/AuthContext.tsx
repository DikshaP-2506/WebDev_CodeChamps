import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profileCompleted: boolean;
  setProfileCompleted: (completed: boolean) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileCompleted, setProfileCompletedState] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        // Check localStorage for profile completion status
        const completed = localStorage.getItem(`profileCompleted_${user.uid}`) === 'true';
        setProfileCompletedState(completed);
      } else {
        setProfileCompletedState(false);
      }
    });
    return unsubscribe;
  }, []);

  const setProfileCompleted = (completed: boolean) => {
    if (user) {
      localStorage.setItem(`profileCompleted_${user.uid}`, completed ? 'true' : 'false');
    }
    setProfileCompletedState(completed);
  };

  const logout = async () => {
    try {
      console.log('AuthContext: Starting logout process...');
      await signOut(auth);
      console.log('AuthContext: Firebase signOut successful');
      // Clear profile completion status
      if (user) {
        localStorage.removeItem(`profileCompleted_${user.uid}`);
        console.log('AuthContext: Cleared profile completion status');
      }
      console.log('AuthContext: Logout process completed');
    } catch (error) {
      console.error('AuthContext: Error signing out:', error);
      throw error; // Re-throw to let the component handle it
    }
  };

  const value = {
    user,
    loading,
    profileCompleted,
    setProfileCompleted,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 