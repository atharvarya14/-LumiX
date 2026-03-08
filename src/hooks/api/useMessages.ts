/**
 * React Query hooks for Messages resource
 * Handles GET/POST/DELETE message operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/services/api";
import {
  Message,
  MessageListResponse,
  MessageDetailResponse,
  ApiResponse,
} from "@/types/api";

const MESSAGES_QUERY_KEY = "messages";

// ==================== GET QUERIES ====================

export const useGetInbox = (filters?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [MESSAGES_QUERY_KEY, "inbox", filters],
    queryFn: async () => {
      const response = await apiClient.get<MessageListResponse>(
        "/messages/inbox",
        { params: filters }
      );
      return response.data.data.messages;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for fresh messages
  });
};

export const useGetSent = () => {
  return useQuery({
    queryKey: [MESSAGES_QUERY_KEY, "sent"],
    queryFn: async () => {
      const response = await apiClient.get<MessageListResponse>(
        "/messages/sent"
      );
      return response.data.data.messages;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetMessage = (messageId: string) => {
  return useQuery({
    queryKey: [MESSAGES_QUERY_KEY, messageId],
    queryFn: async () => {
      const response = await apiClient.get<MessageDetailResponse>(
        `/messages/${messageId}`
      );
      return response.data.data.message;
    },
    enabled: !!messageId,
    staleTime: 5 * 60 * 1000,
  });
};

// ==================== MUTATIONS ====================

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      recipients: string[];
      subject?: string;
      body: string;
      attachments?: string[];
      classId?: string;
      isAnnouncement?: boolean;
      parentMessageId?: string;
    }) => {
      const response = await apiClient.post<ApiResponse<{ message: Message }>>(
        "/messages",
        data
      );
      return response.data.data.message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [MESSAGES_QUERY_KEY, "inbox"],
      });
      queryClient.invalidateQueries({
        queryKey: [MESSAGES_QUERY_KEY, "sent"],
      });
    },
  });
};

export const useDeleteMessage = (messageId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/messages/${messageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [MESSAGES_QUERY_KEY, "inbox"],
      });
      queryClient.invalidateQueries({
        queryKey: [MESSAGES_QUERY_KEY, "sent"],
      });
    },
  });
};
