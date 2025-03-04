import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useToast } from "components/toast/toast-context";
import { axiosInterceptor } from "utils/axios-utils";

export interface Notification {
  _id: string;
  title: string;
  description: string;
  sender?: {
    name: string;
    role: string;
  };
  recipient?: {
    name: string;
    role: string;
  };
  read: boolean;
  createdAt: string;
}

/**
 * Base hook for notifications functionality
 */
export const useNotifications = (
  navigation: any,
  type: "received" | "sent" = "received"
) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();

  const ITEMS_PER_PAGE = 10;

  // Fetch notifications (received or sent)
  const fetchNotifications = useCallback(
    async (pageNum: number = 1) => {
      if (!token) return;

      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsFetchingNextPage(true);
      }

      setError(null);

      try {
        const endpoint =
          type === "received"
            ? "/v1/notifications/received"
            : "/v1/notifications/sent";

        const response = await axiosInterceptor({
          url: endpoint,
          method: "GET",
          params: {
            page: pageNum,
            limit: ITEMS_PER_PAGE,
          },
          token,
        });

        const newNotifications = response?.data?.records || [];

        if (pageNum === 1) {
          setNotifications(newNotifications);
        } else {
          setNotifications((prev) => [...prev, ...newNotifications]);
        }

        setHasNextPage(newNotifications.length >= ITEMS_PER_PAGE);
        setPage(pageNum);
      } catch (err) {
        console.error(`Error fetching ${type} notifications:`, err);
        setError(`Failed to load ${type} notifications`);
        toast.show({
          message: `Failed to load ${type} notifications`,
          preset: "error",
        });
      } finally {
        if (pageNum === 1) {
          setIsLoading(false);
        } else {
          setIsFetchingNextPage(false);
        }
      }
    },
    [token, toast, type]
  );

  // Handle fetching the next page
  const fetchNextPage = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) return;

    fetchNotifications(page + 1);
  }, [fetchNotifications, hasNextPage, isFetchingNextPage, page]);

  // Navigation handler for notification details
  const handleNotificationNavigation = useCallback(
    (notification: Notification) => {
      // TODO: Implement navigation to the appropriate screen based on notification type
      console.log("Navigate to notification details:", notification._id);
    },
    []
  );

  // Fetch initial data on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    handleNotificationNavigation,
    refetch: () => fetchNotifications(1),
  };
};

/**
 * Hook for received notifications
 */
export const useReceivedNotifications = (navigation: any) => {
  return useNotifications(navigation, "received");
};

/**
 * Hook for sent notifications
 */
export const useSentNotifications = (navigation: any) => {
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [description, setDescription] = useState("");
  const [loadSendingNotification, setLoadSendingNotification] = useState(false);

  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();

  const baseHook = useNotifications(navigation, "sent");

  // Open the send notification dialog
  const openSendDialog = useCallback(() => {
    setShowSendDialog(true);
  }, []);

  // Cancel sending notification
  const cancelSend = useCallback(() => {
    setShowSendDialog(false);
    setDescription("");
  }, []);

  // Send notification
  const sendNotification = useCallback(async () => {
    if (!token || !description.trim()) {
      toast.show({
        message: "Please enter a description",
        preset: "error",
      });
      return;
    }

    setLoadSendingNotification(true);

    try {
      await axiosInterceptor({
        url: "/v1/notifications",
        method: "POST",
        data: {
          description: description.trim(),
        },
        token,
      });

      toast.show({
        message: "Notification sent successfully",
      });

      setDescription("");
      setShowSendDialog(false);
      baseHook.refetch();
    } catch (err) {
      console.error("Error sending notification:", err);
      toast.show({
        message: "Failed to send notification",
        preset: "error",
      });
    } finally {
      setLoadSendingNotification(false);
    }
  }, [token, description, toast, baseHook]);

  return {
    ...baseHook,
    showSendDialog,
    description,
    loadSendingNotification,
    setDescription,
    openSendDialog: openSendDialog,
    cancelSend,
    sendNotification,
  };
};
