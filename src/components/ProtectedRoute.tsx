import { Navigate } from 'react-router-dom';
import { useWeb3AuthConnect } from "@web3auth/modal/react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isConnected } = useWeb3AuthConnect();

  if (!isConnected) {
    return <Navigate to="/signup" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;