import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/apiClient';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        try {
          const response = await apiClient.get('/users/me');
          if (response.status === 200) {
            setUser(response.data);
          } else {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error('認証チェックエラー:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};