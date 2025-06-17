import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Add your authentication logic here
  // For now, we'll just return the children
  return <>{children}</>;
};

export default ProtectedRoute;
