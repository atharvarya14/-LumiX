/**
 * Auth Context - Manages authentication state and provides auth methods
 * Persists tokens to localStorage and restores session on app mount
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import apiClient from "@/services/api";
import {
  User,
  AuthResponse,
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  MeResponse,
  getRoleDashboard,
} from "@/types/api"

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Methods
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  getMe: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth from localStorage on app mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");
        const storedUser = localStorage.getItem("user");

        if (storedAccessToken && storedRefreshToken) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);

          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (e) {
              console.error("Failed to parse user from localStorage", e);
            }
          }

          // Validate token by calling /api/auth/me
          try {
            const response = await apiClient.get<MeResponse>("/auth/me");
            if (response.data.success) {
              setUser(response.data.data.user);
              localStorage.setItem("user", JSON.stringify(response.data.data.user));
            }
          } catch (e) {
            // Token might be invalid, clear auth
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            setAccessToken(null);
            setRefreshToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        setError("Failed to restore session");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        "/auth/login",
        credentials
      );

      if (response.data.success) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: newUser } =
          response.data.data;

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setUser(newUser);

        // Persist to localStorage
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        localStorage.setItem("user", JSON.stringify(newUser));
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        "/auth/register",
        data
      );

      if (response.data.success) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: newUser } =
          response.data.data;

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setUser(newUser);

        // Persist to localStorage
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        localStorage.setItem("user", JSON.stringify(newUser));
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      console.error("Error response:", err.response?.data);
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        err.message ||
        "Registration failed";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Call logout endpoint to invalidate refresh token server-side
      try {
        await apiClient.post("/auth/logout");
      } catch (err) {
        // Even if logout endpoint fails, clear local auth
        console.error("Error calling logout endpoint:", err);
      }

      // Clear local state
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setError(null);

      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Remove auth header from axios
      delete apiClient.defaults.headers.common["Authorization"];
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTokens = async () => {
    // This is handled by the axios interceptor, but keeping for explicit use if needed
    // No-op since interceptor handles it automatically
  };

  const getMe = async () => {
    try {
      const response = await apiClient.get<MeResponse>("/auth/me");
      if (response.data.success) {
        setUser(response.data.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to fetch user profile";
      setError(message);
      throw new Error(message);
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    isAuthenticated: !!user && !!accessToken,
    login,
    register,
    logout,
    refreshTokens,
    getMe,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 * Throws error if used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
