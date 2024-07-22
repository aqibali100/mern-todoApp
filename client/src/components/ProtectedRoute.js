import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, adminOnly, userOnly = false }) => {
  const { user } = useSelector(state => state.auth);

  if (!user) {
    return <Navigate to="/" />;
  }

  if (adminOnly && user.role === 'user') {
    return <Navigate to="/user_dashboard" />;
  }

  if (userOnly && user.role === 'admin') {
    return <Navigate to="/admin_dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
