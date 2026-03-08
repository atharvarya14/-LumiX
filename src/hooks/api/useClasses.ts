/**
 * React Query hooks for Classes resource
 * Handles GET/POST/PUT/DELETE class operations and student management
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/api";
import {
  Class,
  ClassListResponse,
  ClassDetailResponse,
  ApiResponse,
} from "@/types/api";

const CLASSES_QUERY_KEY = "classes";

// ==================== GET QUERIES ====================

export const useGetClasses = (filters?: { classId?: string }) => {
  return useQuery({
    queryKey: [CLASSES_QUERY_KEY, filters],
    queryFn: async () => {
      const response = await apiClient.get<ClassListResponse>("/classes", {
        params: filters,
      });
      return response.data.data.classes;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetClass = (classId: string) => {
  return useQuery({
    queryKey: [CLASSES_QUERY_KEY, classId],
    queryFn: async () => {
      const response = await apiClient.get<ClassDetailResponse>(
        `/classes/${classId}`
      );
      return response.data.data.class;
    },
    enabled: !!classId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetClassStudents = (classId: string) => {
  return useQuery({
    queryKey: [CLASSES_QUERY_KEY, classId, "students"],
    queryFn: async () => {
      const response = await apiClient.get<
        ApiResponse<{ students: any[]; count: number }>
      >(`/classes/${classId}/students`);
      return response.data.data.students;
    },
    enabled: !!classId,
    staleTime: 5 * 60 * 1000,
  });
};

// ==================== MUTATIONS ====================

export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      subject: string;
      grade: string;
      description?: string;
    }) => {
      const response = await apiClient.post<ApiResponse<{ class: Class }>>(
        "/classes",
        data
      );
      return response.data.data.class;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLASSES_QUERY_KEY] });
    },
  });
};

export const useUpdateClass = (classId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Class>) => {
      const response = await apiClient.put<ApiResponse<{ class: Class }>>(
        `/classes/${classId}`,
        data
      );
      return response.data.data.class;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLASSES_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [CLASSES_QUERY_KEY, classId],
      });
    },
  });
};

export const useDeleteClass = (classId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/classes/${classId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLASSES_QUERY_KEY] });
    },
  });
};

export const useAddStudents = (classId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { studentIds: string[] }) => {
      const response = await apiClient.post<
        ApiResponse<{ students: any[] }>
      >(`/classes/${classId}/students`, data);
      return response.data.data.students;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CLASSES_QUERY_KEY, classId, "students"],
      });
    },
  });
};

export const useRemoveStudent = (classId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentId: string) => {
      await apiClient.delete(`/classes/${classId}/students/${studentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CLASSES_QUERY_KEY, classId, "students"],
      });
    },
  });
};
