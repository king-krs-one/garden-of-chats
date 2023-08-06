import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './authMiddleware';

const ProtectedRoute = ({ element: Element }) => {
  return isAuthenticated() ? Element : (
    <Navigate 
      to="/login" 
      state={{ message: { type: "error", text: 'Authentication failed. Please log in again.' } }} />
  )
}; 

export default ProtectedRoute;