import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER } from "@/constants";
import { fetchLogin, fetchUserMe } from "@/api/services/users.ts";
import { UserMe } from "@/api/types/users.ts";

interface UserContextType {
  user: UserMe | null;
  setUser: (user: UserMe | null) => void;
  logout: () => void;
  login: (email: string, password: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

// TODO: Rework authentication

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserMe | null>(() => {
    const storedUser = localStorage.getItem(USER);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      if (!user && localStorage.getItem(ACCESS_TOKEN)) {
        const response = await fetchUserMe();

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
    navigate("/login");
  };

  const login = async (email: string, password: string) => {
    const response = await fetchLogin(email, password);

    if (response.status === 200) {
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      setUser(response.data.user);
      navigate("/communities");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, login }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
