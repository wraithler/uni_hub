import React, {
  ComponentType,
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserMe } from "@/api/users/userTypes.ts";
import api from "@/api/apiClient.ts";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner.tsx";

type AuthResponseType = {
  success: boolean;
  error?: string;
};

type SessionAuthContextType = {
  user: UserMe | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponseType>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<AuthResponseType>;
  logout: () => Promise<AuthResponseType>;
  checkAuthStatus: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<AuthResponseType>;
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: (uid: string, token: string) => Promise<void>;
};

const SessionAuthContext = createContext<SessionAuthContextType | null>(null);

type SessionAuthProviderProps = {
  children: ReactNode;
};

export const SessionAuthProvider: React.FC<SessionAuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<UserMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      setLoading(true);

      await api.get("/auth/get-csrf-token/");

      const response = await api.get("/auth/me/");
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<AuthResponseType> => {
    try {
      setLoading(true);
      setError(null);

      await api.get("/auth/get-csrf-token/");

      const response = await api.post("/auth/login/", { email, password });
      console.log(response);
      setUser(response.data);
      return { success: true };
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.detail;
      }
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<AuthResponseType> => {
    try {
      setLoading(true);
      setError(null);

      await api.get("/auth/get-csrf-token/");

      const response = await api.post("/auth/register/", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });

      setUser(response.data);
      return { success: true };
    } catch (err) {
      let errorMessage = "Registration failed. Please try again.";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.detail;
      }
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<AuthResponseType> => {
    try {
      setLoading(true);
      await api.post("/auth/logout/");
      setUser(null);
      return { success: true };
    } catch (err) {
      let errorMessage = "Logout failed. Please try again.";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.detail;
      }
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (
    email: string,
  ): Promise<AuthResponseType> => {
    try {
      setLoading(true);
      setError(null);

      await api.post("/auth/password-reset/", { email });
      return { success: true };
    } catch (err) {
      let errorMessage = "Password reset request failed. Please try again.";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.detail;
      }
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    await api.get("/users/send-email-verification/");
  };

  const verifyEmail = async (uid: string, token: string) => {
    await api.post("/users/verify-email/", { uid, token });
  };

  const value: SessionAuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuthStatus,
    requestPasswordReset,
    sendVerificationEmail,
    verifyEmail
  };

  return (
    <SessionAuthContext.Provider value={value}>
      {children}
    </SessionAuthContext.Provider>
  );
};

export const useAuth = (): SessionAuthContextType => {
  const context = useContext(SessionAuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within SessionAuthProvider");
  }
  return context;
};

export function withAuth<P extends object>(Component: ComponentType<P>): FC<P> {
  return (props: P) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return <Spinner />;
    }

    if (!isAuthenticated) {
      window.location.href = "/login";
      return null;
    }

    return <Component {...props} />;
  };
}
