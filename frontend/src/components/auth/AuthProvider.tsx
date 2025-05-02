import { UserMe } from "@/api/users/userTypes.ts";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants.ts";
import api from "@/api/apiClient.ts";

interface AuthContextProps {
  isAuthenticated: boolean;
  user: UserMe | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: (uid: string, token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserMe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to refresh the token
  const refreshAuthToken = async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await api.post("/auth/token/refresh/", {
        refresh: refreshToken,
      });

      const { access } = response.data;
      localStorage.setItem(ACCESS_TOKEN, access);

      return access;
    } catch (error) {
      // If refresh fails, clear everything
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      throw error;
    }
  };

  const verifyToken = async (token: string) => {
    try {
      const response = await api.get("/auth/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAuthenticated(true);
      setUser(response.data);
      return true;
    } catch (error) {
      // Try to refresh the token if verification fails
      try {
        const newToken = await refreshAuthToken();
        const response = await api.get("/auth/me/", {
          headers: { Authorization: `Bearer ${newToken}` },
        });
        setIsAuthenticated(true);
        setUser(response.data);
        return true;
      } catch {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem(ACCESS_TOKEN);

      if (token) {
        await verifyToken(token);
      } else {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/token/", { email, password });

      const { access, refresh } = response.data;
      localStorage.setItem(ACCESS_TOKEN, access);
      localStorage.setItem(REFRESH_TOKEN, refresh);

      await verifyToken(access);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => {
    logout();

    try {
      const response = await api.post("/users/create/", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });

      if (response.status === 200) {
        await login(email, password);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const sendVerificationEmail = async () => {
    await api.get("/users/send-email-verification/");
  };

  const verifyEmail = async (uid: string, token: string) => {
    await api.post("/users/verify-email/", { uid, token });
  }

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshAuthToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch(refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        sendVerificationEmail,
        verifyEmail,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};