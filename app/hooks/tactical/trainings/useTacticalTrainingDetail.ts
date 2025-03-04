import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useToast } from "components/toast/toast-context";
import {
  trainingService,
  Training,
  TrainingImage,
} from "services/api/trainingService";
import { parseFormDateTime } from "utils/dateTime";

/**
 * Custom hook for tactical role training detail screen
 * Extends useTrainingDetail with edit functionality
 */
export const useTacticalTrainingDetail = (route, navigation) => {
  const trainingId = route?.params?._id;
  const toast = useToast();
  const token = useSelector((state: RootState) => state.login.accessToken);
  const meData = useSelector((state: RootState) => state.login.userData);

  // State management
  const [training, setTraining] = useState<Training | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [showAssignConfirmation, setShowAssignConfirmation] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [updatedImages, setUpdatedImages] = useState<TrainingImage[]>([]);

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

  // Fetch training data
  const fetchTraining = useCallback(async () => {
    if (!trainingId || !token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const data = await trainingService.getTrainingById(trainingId, token);
      setTraining(data);

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
      console.error("Error fetching training details:", error);
      toast.show({
        message: "Failed to load training details",
        preset: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [trainingId, token, toast]);

  // Handlers for UI interactions
  const handleEdit = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    // Reset any changes
    fetchTraining();
  }, [fetchTraining]);

  const handleUpdate = useCallback(async () => {
    if (!training || !token) return;

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
        ...training,
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

      // Send update
      await trainingService.updateTraining(trainingId, updateData, token);

      toast.show({
        message: "Training updated successfully",
      });

      setIsEditing(false);
      await fetchTraining();
    } catch (error) {
      console.error("Error updating training:", error);
      toast.show({
        message: "Failed to update training",
        preset: "error",
      });
    } finally {
      setIsUpdateLoading(false);
    }
  }, [
    training,
    token,
    trainingId,
    dateTimeValues,
    updatedImages,
    toast,
    fetchTraining,
  ]);

  const handleDelete = useCallback(async () => {
    if (!trainingId || !token) return;

    setIsDeleteLoading(true);

    try {
      await trainingService.deleteTraining(trainingId, token);

      toast.show({
        message: "Training deleted successfully",
      });

      setIsDeleteDialogVisible(false);
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting training:", error);
      toast.show({
        message: "Failed to delete training",
        preset: "error",
      });
    } finally {
      setIsDeleteLoading(false);
    }
  }, [trainingId, token, toast, navigation]);

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
    if (!training || !trainingId) return;

    navigation.navigate("AssignTrainingScreen", {
      trainingId: trainingId,
      training: training,
    });
  }, [trainingId, training, navigation]);

  // Fetch data on mount
  useEffect(() => {
    fetchTraining();
  }, [fetchTraining]);

  return {
    training,
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
    fetchTraining,
  };
};
