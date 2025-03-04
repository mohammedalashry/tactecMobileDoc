import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useToast } from "components/toast/toast-context";
import { taskService, Task, TaskImage } from "services/api/taskService";
import { parseFormDateTime } from "utils/dateTime";

/**
 * Custom hook for tactical role task detail screen
 * Extends useTaskDetail with edit functionality
 */
export const useTacticalTaskDetail = (route, navigation) => {
  const taskId = route?.params?._id;
  const toast = useToast();
  const token = useSelector((state: RootState) => state.login.accessToken);
  const meData = useSelector((state: RootState) => state.login.userData);

  // State management
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [showAssignConfirmation, setShowAssignConfirmation] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [updatedImages, setUpdatedImages] = useState<TaskImage[]>([]);

  // DateTime state for editing
  const [dateTimeValues, setDateTimeValues] = useState({
    day: "",
    month: "",
    year: "",
    hours: "",
    minutes: "",
    ampm: "am",
  });

  // Determine if user has edit permissions
  const canEdit = meData?.dataEntry || meData?.role === "tactical";

  // Fetch task data
  const fetchTask = useCallback(async () => {
    if (!taskId || !token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await taskService.getTaskById(taskId, token);
      const data = response.data;

      setTask(data);

      // Initialize images for editing
      if (data.images && data.images.length > 0) {
        setUpdatedImages(data.images);
      }

      // Initialize date/time values
      if (data.date) {
        const date = new Date(data.date);
        setDateTimeValues({
          day: date.getDate().toString(),
          month: (date.getMonth() + 1).toString(),
          year: date.getFullYear().toString(),
          hours:
            date.getHours() > 12
              ? (date.getHours() - 12).toString()
              : date.getHours().toString(),
          minutes: date.getMinutes().toString().padStart(2, "0"),
          ampm: date.getHours() >= 12 ? "pm" : "am",
        });
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast.show({
        message: "Failed to load task details",
        preset: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [taskId, token, toast]);

  // Handlers for UI interactions
  const handleEdit = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    // Reset any changes
    fetchTask();
  }, [fetchTask]);

  const handleUpdate = useCallback(async () => {
    if (!task || !token) return;

    setIsUpdateLoading(true);

    try {
      // Create date from form values
      const date = parseFormDateTime(
        dateTimeValues.day,
        dateTimeValues.month,
        dateTimeValues.year,
        dateTimeValues.hours,
        dateTimeValues.minutes,
        dateTimeValues.ampm
      );

      // Prepare update data
      const updateData = {
        ...task,
        date: date.toISOString(),
        images: updatedImages.map((img) => ({
          url: img.url,
          description: img.description || "",
        })),
      };

      // Remove internal fields that shouldn't be sent to API
      delete updateData._id;
      delete updateData.createdAt;
      delete updateData.updatedAt;
      delete updateData.players;
      delete updateData.teams;

      // Send update
      await taskService.updateTask(taskId, updateData, token);

      toast.show({
        message: "Task updated successfully",
      });

      setIsEditing(false);
      await fetchTask();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.show({
        message: "Failed to update task",
        preset: "error",
      });
    } finally {
      setIsUpdateLoading(false);
    }
  }, [task, token, taskId, dateTimeValues, updatedImages, toast, fetchTask]);

  const handleDelete = useCallback(async () => {
    if (!taskId || !token) return;

    setIsDeleteLoading(true);

    try {
      await taskService.deleteTask(taskId, token);

      toast.show({
        message: "Task deleted successfully",
      });

      setIsDeleteDialogVisible(false);
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.show({
        message: "Failed to delete task",
        preset: "error",
      });
    } finally {
      setIsDeleteLoading(false);
    }
  }, [taskId, token, toast, navigation]);

  const handleImageUpdate = useCallback(
    (index: number, description: string) => {
      setUpdatedImages((prev) => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = {
            ...updated[index],
            description,
          };
        }
        return updated;
      });
    },
    []
  );

  const handleAssign = useCallback(() => {
    if (!task || !taskId) return;

    navigation.navigate("AssignTaskScreen", {
      taskId: taskId,
      task: task,
    });
  }, [taskId, task, navigation]);

  // Fetch data on mount
  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  return {
    task,
    isLoading,
    isEditing,
    canEdit,
    activeSlide,
    setActiveSlide,
    updatedImages,
    dateTimeValues,
    setDateTimeValues,
    isDeleteDialogVisible,
    setIsDeleteDialogVisible,
    showAssignConfirmation,
    setShowAssignConfirmation,
    isUpdateLoading,
    isDeleteLoading,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleCancel,
    handleImageUpdate,
    handleAssign,
    fetchTask,
  };
};
