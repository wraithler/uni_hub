import { UserMe } from "@/api/users/userTypes.ts";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants.ts";
import axios from "axios";
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

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      verifyToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await api.get("/auth/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAuthenticated(true);
      setUser(response.data);
    } catch {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem(ACCESS_TOKEN);
    } finally {
      setIsLoading(false);
    }
  };

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
    await api.post("/users/verify-email", { uid, token });
  }

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);
            const response = await api.post("/auth/token/refresh/", {
              refresh: refreshToken,
            });

            const { access } = response.data;
            localStorage.setItem(ACCESS_TOKEN, access);

            originalRequest.headers.Authorization = `Bearer ${access}`;
            return axios(originalRequest);
          } catch {
            logout();
            window.location.href = "/login";
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
      {!isLoading && children}
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
