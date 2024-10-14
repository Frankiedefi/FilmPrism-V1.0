import React from 'react';
import { Navigate } from 'react-router-dom';

// TODO: Implement actual authentication check
const isAuthenticated = () => {
  return true; // For now, always return true
};

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
}

export default PrivateRoute;