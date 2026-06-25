import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../firebase/authService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null); // { message, type: 'success' | 'error' | 'info' }

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper to trigger floating notifications
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Sign In wrapper
  const login = async (email, password) => {
    setLoading(true);
    try {
      const user = await authService.signIn(email, password);
      setCurrentUser(user);
      showNotification(`Welcome back, ${user.name}!`, 'success');
      return user;
    } catch (error) {
      showNotification(error.message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign Up wrapper
  const signup = async (email, password, role, name, extraDetails = {}) => {
    setLoading(true);
    try {
      const user = await authService.signUp(email, password, role, name, extraDetails);
      setCurrentUser(user);
      showNotification(`Account created! Welcome, ${name}.`, 'success');
      return user;
    } catch (error) {
      showNotification(error.message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign Out wrapper
  const logout = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setCurrentUser(null);
      showNotification("You have logged out.", 'info');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Force refreshing user profile (e.g. after earning points)
  const refreshUser = () => {
    if (!currentUser) return;
    if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
      // If mock, pull fresh copy from LocalStorage current user
      const curr = localStorage.getItem('harit_current_user');
      if (curr) setCurrentUser(JSON.parse(curr));
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      loading,
      login,
      signup,
      logout,
      notification,
      showNotification,
      refreshUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
