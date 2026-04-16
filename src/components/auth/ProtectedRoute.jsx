import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticatedForRole } from '../../utils/auth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthorized = isAuthenticatedForRole(requiredRole);

  if (!isAuthorized) {
    return <Navigate to="/login/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
