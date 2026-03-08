/**
 * React Query hooks for LessonPlans resource
 * Handles GET/POST/PUT/DELETE lesson plan operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/api";
import {
  LessonPlan,
  LessonPlanListResponse,
  LessonPlanDetailResponse,
  ApiResponse,
} from "@/types/api";

const LESSON_PLANS_QUERY_KEY = "lesson-plans";

// ==================== GET QUERIES ====================

export const useGetLessonPlans = (filters?: {
  status?: string;
  classId?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [LESSON_PLANS_QUERY_KEY, filters],
    queryFn: async () => {
      const response = await apiClient.get<LessonPlanListResponse>(
        "/lesson-plans",
        { params: filters }
      );
      return response.data.data.plans;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetLessonPlan = (planId: string) => {
  return useQuery({
    queryKey: [LESSON_PLANS_QUERY_KEY, planId],
    queryFn: async () => {
      const response = await apiClient.get<LessonPlanDetailResponse>(
        `/lesson-plans/${planId}`
      );
      return response.data.data.plan;
    },
    enabled: !!planId,
    staleTime: 5 * 60 * 1000,
  });
};

// ==================== MUTATIONS ====================

export const useCreateLessonPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      subject: string;
      grade: string;
      description?: string;
      objectives?: string[];
      content?: string;
      resources?: string[];
      duration?: number;
      class?: string;
      scheduledDate?: string;
      status?: string;
      tags?: string[];
    }) => {
      const response = await apiClient.post<
        ApiResponse<{ plan: LessonPlan }>
      >("/lesson-plans", data);
      return response.data.data.plan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [LESSON_PLANS_QUERY_KEY],
      });
    },
  });
};

export const useUpdateLessonPlan = (planId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<LessonPlan>) => {
      const response = await apiClient.put<ApiResponse<{ plan: LessonPlan }>>(
        `/lesson-plans/${planId}`,
        data
      );
      return response.data.data.plan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [LESSON_PLANS_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [LESSON_PLANS_QUERY_KEY, planId],
      });
    },
  });
};

export const useDeleteLessonPlan = (planId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/lesson-plans/${planId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [LESSON_PLANS_QUERY_KEY],
      });
    },
  });
};
