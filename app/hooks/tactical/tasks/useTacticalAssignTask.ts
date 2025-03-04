import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useToast } from "components/toast/toast-context";
import { axiosInterceptor } from "utils/axios-utils";
import { taskService } from "services/api/taskService";

/**
 * Custom hook for tactical role task assignment
 */
export const useTacticalAssignTask = (route, navigation) => {
  const { taskId, task: initialTask } = route.params;
  const toast = useToast();
  const token = useSelector((state: RootState) => state.login.accessToken);

  // State management
  const [task, setTask] = useState(initialTask);
  const [isLoading, setIsLoading] = useState(!initialTask);
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  // Fetch task if not provided
  const fetchTask = useCallback(async () => {
    if (!taskId || !token || initialTask) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await taskService.getTaskById(taskId, token);
      setTask(response.data);
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast.show({
        message: "Failed to load task details",
        preset: "error",
      });
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  }, [taskId, token, initialTask, toast, navigation]);

  // Fetch players
  const fetchPlayers = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);

    try {
      const response = await axiosInterceptor({
        url: "/v1/players?pageSize=50",
        method: "GET",
        token,
      });

      if (response.data && response.data.records) {
        // Alternate row colors for better readability
        const playersWithBg = response.data.records.map((player, index) => ({
          ...player,
          backgroundColor: index % 2 === 0 ? color.blackbg : color.background,
        }));
        setPlayers(playersWithBg);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      toast.show({
        message: "Failed to load players",
        preset: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, toast]);

  // Toggle player selection
  const togglePlayerSelection = useCallback((playerId) => {
    setSelectedPlayers((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId);
      } else {
        return [...prev, playerId];
      }
    });
  }, []);

  // Toggle select all players
  const toggleSelectAll = useCallback(() => {
    setSelectedPlayers((prev) => {
      // If all are selected (or if list is empty), deselect all
      if (prev.length === players.length) {
        return [];
      }
      // Otherwise select all
      return players.map((player) => player._id);
    });
  }, [players]);

  // Check if all players are selected
  const isAllSelected =
    selectedPlayers.length === players.length && players.length > 0;

  // Handle confirm button press
  const handleConfirm = useCallback(async () => {
    if (!taskId || !token || selectedPlayers.length === 0) {
      toast.show({
        message: "Please select at least one player",
        preset: "error",
      });
      return;
    }

    setIsAssigning(true);

    try {
      await axiosInterceptor({
        url: `/v1/tasks/${taskId}/assign`,
        method: "POST",
        data: {
          players: selectedPlayers,
        },
        token,
      });

      setConfirmationVisible(true);
    } catch (error) {
      console.error("Error assigning task:", error);
      toast.show({
        message: "Failed to assign task",
        preset: "error",
      });
    } finally {
      setIsAssigning(false);
    }
  }, [taskId, token, selectedPlayers, toast]);

  // Handle cancel button press
  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Fetch data on mount
  useEffect(() => {
    fetchTask();
    fetchPlayers();
  }, [fetchTask, fetchPlayers]);

  return {
    task,
    isLoading,
    players,
    selectedPlayers,
    toggleSelectAll,
    isAllSelected,
    togglePlayerSelection,
    handleConfirm,
    handleCancel,
    isAssigning,
    confirmationVisible,
    setConfirmationVisible,
  };
};
