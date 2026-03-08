/**
 * React Query hooks for Timetables resource
 * Handles GET/POST/PUT/DELETE timetable and entry operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/api";
import {
  Timetable,
  TimetableEntry,
  TimetableListResponse,
  TimetableDetailResponse,
  ApiResponse,
} from "@/types/api";

const TIMETABLES_QUERY_KEY = "timetables";

// ==================== GET QUERIES ====================

export const useGetTimetables = (filters?: {
  classId?: string;
  active?: boolean;
}) => {
  return useQuery({
    queryKey: [TIMETABLES_QUERY_KEY, filters],
    queryFn: async () => {
      const response = await apiClient.get<TimetableListResponse>(
        "/timetables",
        { params: filters }
      );
      return response.data.data.timetables;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetTimetable = (timetableId: string) => {
  return useQuery({
    queryKey: [TIMETABLES_QUERY_KEY, timetableId],
    queryFn: async () => {
      const response = await apiClient.get<TimetableDetailResponse>(
        `/timetables/${timetableId}`
      );
      return response.data.data.timetable;
    },
    enabled: !!timetableId,
    staleTime: 5 * 60 * 1000,
  });
};

// ==================== MUTATIONS ====================

export const useCreateTimetable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      academicYear: string;
      term?: string;
      class?: string;
      teacher?: string;
      isActive?: boolean;
      entries?: TimetableEntry[];
    }) => {
      const response = await apiClient.post<ApiResponse<{ timetable: Timetable }>>(
        "/timetables",
        data
      );
      return response.data.data.timetable;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TIMETABLES_QUERY_KEY],
      });
    },
  });
};

export const useUpdateTimetable = (timetableId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Timetable>) => {
      const response = await apiClient.put<ApiResponse<{ timetable: Timetable }>>(
        `/timetables/${timetableId}`,
        data
      );
      return response.data.data.timetable;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TIMETABLES_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [TIMETABLES_QUERY_KEY, timetableId],
      });
    },
  });
};

export const useDeleteTimetable = (timetableId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/timetables/${timetableId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TIMETABLES_QUERY_KEY],
      });
    },
  });
};

export const useAddTimetableEntry = (timetableId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      dayOfWeek: string;
      startTime: string;
      endTime: string;
      subject: string;
      class: string;
      teacher: string;
      room?: string;
      notes?: string;
    }) => {
      const response = await apiClient.post<ApiResponse<{ timetable: Timetable }>>(
        `/timetables/${timetableId}/entries`,
        data
      );
      return response.data.data.timetable;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TIMETABLES_QUERY_KEY, timetableId],
      });
    },
  });
};

export const useRemoveTimetableEntry = (timetableId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: string) => {
      await apiClient.delete(`/timetables/${timetableId}/entries/${entryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TIMETABLES_QUERY_KEY, timetableId],
      });
    },
  });
};
