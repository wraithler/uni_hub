import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';
import api from '@/api';
import { UserProvider } from './UserProvider';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthorised, setIsAuthorised] = useState<boolean | null>(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorised(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    try {
      const response = await api.post('api/auth/token/refresh/', {
        refresh: refreshToken,
      });

      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        setIsAuthorised(true);
      } else {
        setIsAuthorised(false);
      }
    } catch (error) {
      setIsAuthorised(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
      setIsAuthorised(false);
      return;
    }

    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;

    if (!tokenExpiration) {
      setIsAuthorised(false);
      return;
    }

    const now = Math.floor(Date.now() / 1000);

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorised(true);
    }
  };

  if (isAuthorised === null) {
    return <div>Loading...</div>;
  }

  return isAuthorised ? <UserProvider>{children}</UserProvider> : <Navigate to="/login" />;
}

export default ProtectedRoute;
