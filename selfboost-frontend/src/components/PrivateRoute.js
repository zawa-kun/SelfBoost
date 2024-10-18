import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoute = ({ children, authRequired = true }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  if (authRequired && !user) {
    return <Navigate to="/login" />;
  }

  if (!authRequired && user) {
    return <Navigate to="/" />;
  }

  return children;
};