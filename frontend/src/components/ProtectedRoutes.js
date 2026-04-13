import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if a token exists in local storage
  const isAuthenticated = localStorage.getItem('token'); 

  if (!isAuthenticated) {
    // If there is no token, kick them back to the login page
    return <Navigate to="/" replace />;
  }

  // If they have a token, render the requested component
  return children;
};

export default ProtectedRoute;