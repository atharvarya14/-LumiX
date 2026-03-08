/**
 * React Query hooks for Assignments resource
 * Handles GET/POST/PUT/DELETE assignment and submission operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/api";
import {
  Assignment,
  Submission,
  AssignmentListResponse,
  AssignmentDetailResponse,
  ApiResponse,
} from "@/types/api";

const ASSIGNMENTS_QUERY_KEY = "assignments";

// ==================== GET QUERIES ====================

export const useGetAssignments = (filters?: {
  classId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [ASSIGNMENTS_QUERY_KEY, filters],
    queryFn: async () => {
      const response = await apiClient.get<AssignmentListResponse>(
        "/assignments",
        { params: filters }
      );
      return response.data.data.assignments;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetAssignment = (assignmentId: string) => {
  return useQuery({
    queryKey: [ASSIGNMENTS_QUERY_KEY, assignmentId],
    queryFn: async () => {
      const response = await apiClient.get<AssignmentDetailResponse>(
        `/assignments/${assignmentId}`
      );
      return response.data.data.assignment;
    },
    enabled: !!assignmentId,
    staleTime: 5 * 60 * 1000,
  });
};

// ==================== MUTATIONS ====================

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      subject: string;
      class: string;
      dueDate: string;
      totalMarks?: number;
      attachments?: string[];
      instructions?: string;
      status?: string;
    }) => {
      const response = await apiClient.post<
        ApiResponse<{ assignment: Assignment }>
      >("/assignments", data);
      return response.data.data.assignment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ASSIGNMENTS_QUERY_KEY],
      });
    },
  });
};

export const useUpdateAssignment = (assignmentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Assignment>) => {
      const response = await apiClient.put<
        ApiResponse<{ assignment: Assignment }>
      >(`/assignments/${assignmentId}`, data);
      return response.data.data.assignment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ASSIGNMENTS_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [ASSIGNMENTS_QUERY_KEY, assignmentId],
      });
    },
  });
};

export const useDeleteAssignment = (assignmentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/assignments/${assignmentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ASSIGNMENTS_QUERY_KEY],
      });
    },
  });
};

export const useSubmitAssignment = (assignmentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      content?: string;
      attachments?: string[];
    }) => {
      const response = await apiClient.post<
        ApiResponse<{ submission: Submission }>
      >(`/assignments/${assignmentId}/submit`, data);
      return response.data.data.submission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ASSIGNMENTS_QUERY_KEY, assignmentId],
      });
    },
  });
};

export const useGradeSubmission = (
  assignmentId: string,
  submissionId: string
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      grade: number;
      feedback?: string;
    }) => {
      const response = await apiClient.put<
        ApiResponse<{ submission: Submission }>
      >(`/assignments/${assignmentId}/submissions/${submissionId}/grade`, data);
      return response.data.data.submission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ASSIGNMENTS_QUERY_KEY, assignmentId],
      });
    },
  });
};
