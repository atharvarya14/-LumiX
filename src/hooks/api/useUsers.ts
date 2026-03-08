/**
 * React Query hooks for Users resource
 * Handles GET user operations
 */

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/api";
import { User, UserListResponse, UserDetailResponse } from "@/types/api";

const USERS_QUERY_KEY = "users";

// ==================== GET QUERIES ====================

export const useGetUsers = (filters?: {
  role?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, filters],
    queryFn: async () => {
      const response = await apiClient.get<UserListResponse>("/users", {
        params: filters,
      });
      return response.data.data.users;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useGetUser = (userId: string) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, userId],
    queryFn: async () => {
      const response = await apiClient.get<UserDetailResponse>(
        `/users/${userId}`
      );
      return response.data.data.user;
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useGetStudents = (filters?: { role?: string }) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, "student", filters],
    queryFn: async () => {
      const response = await apiClient.get<UserListResponse>("/users", {
        params: { role: "student", ...filters },
      });
      return response.data.data.users;
    },
    staleTime: 10 * 60 * 1000,
  });
};
