import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useToast } from "components/toast/toast-context";
import { matchService, Match, MatchImage } from "services/api/matchService";
import { parseFormDateTime } from "utils/dateTime";

/**
 * Custom hook for tactical role match detail screen
 * Extends useMatchDetail with edit functionality
 */
export const useTacticalMatchDetail = (route, navigation) => {
  const matchId = route?.params?._id;
  const toast = useToast();
  const token = useSelector((state: RootState) => state.login.accessToken);
  const meData = useSelector((state: RootState) => state.login.userData);

  // State management
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [updatedImages, setUpdatedImages] = useState<MatchImage[]>([]);
  const [currentImage, setCurrentImage] = useState<{
    url: string;
    desc: string;
  }>({ url: "", desc: "" });

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

  // Fetch match data
  const fetchMatch = useCallback(async () => {
    if (!matchId || !token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const data = await matchService.getMatchById(matchId, token);
      setMatch(data);

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
      console.error("Error fetching match details:", error);
      toast.show({
        message: "Failed to load match details",
        preset: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [matchId, token, toast]);

  // Handlers for UI interactions
  const handleEdit = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    // Reset any changes
    fetchMatch();
  }, [fetchMatch]);

  const handleUpdate = useCallback(async () => {
    if (!match || !token) return;

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
        ...match,
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

      // Send update
      await matchService.updateMatch(matchId, updateData, token);

      toast.show({
        message: "Match updated successfully",
      });

      setIsEditing(false);
      await fetchMatch();
    } catch (error) {
      console.error("Error updating match:", error);
      toast.show({
        message: "Failed to update match",
        preset: "error",
      });
    } finally {
      setIsUpdateLoading(false);
    }
  }, [match, token, matchId, dateTimeValues, updatedImages, toast, fetchMatch]);

  const handleDelete = useCallback(async () => {
    if (!matchId || !token) return;

    setIsDeleteLoading(true);

    try {
      await matchService.deleteMatch(matchId, token);

      toast.show({
        message: "Match deleted successfully",
      });

      setIsDeleteDialogVisible(false);
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting match:", error);
      toast.show({
        message: "Failed to delete match",
        preset: "error",
      });
    } finally {
      setIsDeleteLoading(false);
    }
  }, [matchId, token, toast, navigation]);

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

  // Fetch data on mount
  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

  return {
    match,
    isLoading,
    isEditing,
    canEdit,
    activeSlide,
    setActiveSlide,
    updatedImages,
    currentImage,
    setCurrentImage,
    dateTimeValues,
    setDateTimeValues,
    isDeleteDialogVisible,
    setIsDeleteDialogVisible,
    isUpdateLoading,
    isDeleteLoading,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleCancel,
    handleImageUpdate,
    fetchMatch,
  };
};
