import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profileCompleted: boolean;
  setProfileCompleted: (completed: boolean) => void;
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

  const value = {
    user,
    loading,
    profileCompleted,
    setProfileCompleted,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 