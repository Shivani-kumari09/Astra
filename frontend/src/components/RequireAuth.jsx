/*import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { SosProvider } from '../context/SosContext';
import AppLayout from './AppLayout';

export default function RequireAuth() {
  const { session } = useAuth();
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return (
    <SosProvider>
      <AppLayout />
    </SosProvider>
  );
}
  /*
