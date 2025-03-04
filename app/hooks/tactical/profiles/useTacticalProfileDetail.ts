import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useToast } from "components/toast/toast-context";
import { axiosInterceptor } from "utils/axios-utils";
import { useCalendar } from "hooks/calendar/useCalendar";

/**
 * Custom hook for tactical role player profile detail screen
 */
export const useTacticalProfileDetail = (route, navigation) => {
  const { playerId } = route.params;
  const toast = useToast();
  const token = useSelector((state: RootState) => state.login.accessToken);

  // State management
  const [playerDetails, setPlayerDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("");
  const [formValues, setFormValues] = useState({
    appearanceTime: "",
    yellowCards: "",
    redCard: "",
  });

  // Button states
  const [buttonStates, setButtonStates] = useState({
    isUpdating: false,
  });

  // Dropdown options
  const redCardsOptions = [
    { label: "YES", value: "YES" },
    { label: "NO", value: "NO" },
  ];

  // Use calendar hook for agenda events
  const { events, loadItems, navigateToEvent } = useCalendar();

  // Fetch player details
  const fetchPlayerDetails = useCallback(async () => {
    if (!playerId || !token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInterceptor({
        url: `/v1/players/${playerId}`,
        method: "GET",
        token,
      });

      const data = response.data;
      setPlayerDetails(data);

      // Initialize form values from player data
      setFormValues({
        appearanceTime: data.appearanceTime?.toString() || "",
        yellowCards: data.yellowCards?.toString() || "",
        redCard: data.redCard ? "YES" : "NO",
      });
    } catch (error) {
      console.error("Error fetching player details:", error);
      toast.show({
        message: "Failed to load player details",
        preset: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [playerId, token, toast]);

  // Fetch leagues
  const fetchLeagues = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axiosInterceptor({
        url: "/v1/leagues/?pageNo=1&pageSize=30",
        method: "GET",
        token,
      });

      const leaguesData = response.data?.records.map((item) => ({
        label: item.name,
        value: item._id,
        icon: item.icon,
      }));

      setLeagues(leaguesData || []);

      // Set default selected league if available
      if (leaguesData && leaguesData.length > 0) {
        setSelectedLeague(leaguesData[0].value);
      }
    } catch (error) {
      console.error("Error fetching leagues:", error);
    }
  }, [token]);

  // Handle form input changes
  const handleInputChange = useCallback((field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Handlers for UI interactions
  const handleEdit = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    // Reset form values
    if (playerDetails) {
      setFormValues({
        appearanceTime: playerDetails.appearanceTime?.toString() || "",
        yellowCards: playerDetails.yellowCards?.toString() || "",
        redCard: playerDetails.redCard ? "YES" : "NO",
      });
    }
  }, [playerDetails]);

  const handleUpdate = useCallback(async () => {
    if (!playerId || !token) return;

    setButtonStates((prev) => ({ ...prev, isUpdating: true }));

    try {
      // Validate input values
      const appearanceTime = parseInt(formValues.appearanceTime, 10);
      const yellowCards = parseInt(formValues.yellowCards, 10);

      if (isNaN(appearanceTime) || isNaN(yellowCards)) {
        throw new Error("Please enter valid numbers");
      }

      // Prepare update data
      const updateData = {
        appearanceTime,
        yellowCards,
        redCard: formValues.redCard === "YES" ? 1 : 0,
      };

      await axiosInterceptor({
        url: `/v1/players/${playerId}`,
        method: "PATCH",
        data: updateData,
        token,
      });

      toast.show({
        message: "Player details updated successfully",
      });

      setIsEditing(false);
      await fetchPlayerDetails();
    } catch (error) {
      console.error("Error updating player details:", error);
      toast.show({
        message: error.message || "Failed to update player details",
        preset: "error",
      });
    } finally {
      setButtonStates((prev) => ({ ...prev, isUpdating: false }));
    }
  }, [playerId, token, formValues, fetchPlayerDetails, toast]);

  // Load agenda items specific to this player
  const loadAgendaItems = useCallback(
    (date) => {
      // Customize the loadItems function from useCalendar if needed
      // For example, you might want to add a player filter
      loadItems(date);
    },
    [loadItems]
  );

  // Fetch data on mount
  useEffect(() => {
    fetchPlayerDetails();
    fetchLeagues();
  }, [fetchPlayerDetails, fetchLeagues]);

  return {
    playerDetails,
    isLoading,
    isEditing,
    leagues,
    selectedLeague,
    setSelectedLeague,
    formValues,
    handleInputChange,
    redCardsOptions,
    buttonStates,
    handleEdit,
    handleUpdate,
    handleCancel,
    events,
    loadAgendaItems,
    navigateToEvent,
  };
};
