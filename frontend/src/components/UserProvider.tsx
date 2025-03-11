import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api';
import { USER } from '@/constants';
import { User } from '@/types';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(USER);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      if (!user) {
        const response = await api.get('/api/user/');

        if (response.status === 200) {
          setUser(response.data);
          localStorage.setItem(USER, JSON.stringify(response.data));
        } else {
          setUser(null);
          localStorage.removeItem(USER);
        }
      }
    }

    fetchUser();
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.clear();
    navigate('/login');
  };

  return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
