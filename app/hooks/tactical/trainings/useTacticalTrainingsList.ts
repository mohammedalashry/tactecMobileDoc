import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useToast } from "components/toast/toast-context";
import { trainingService, Training } from "services/api/trainingService";

/**
 * Custom hook for tactical role trainings list screen
 */
export const useTacticalTrainingsList = (navigation) => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const ITEMS_PER_PAGE = 10;
  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();

  const fetchTrainings = useCallback(
    async (pageNumber = 1) => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      if (pageNumber === 1) {
        setIsLoading(true);
      } else {
        setIsFetchingNextPage(true);
      }

      try {
        const params = {
          page: pageNumber,
          limit: ITEMS_PER_PAGE,
          category: "tactical", // Filter for tactical category trainings
        };

        const data = await trainingService.getAllTrainings(token, params);

        if (pageNumber === 1) {
          setTrainings(data);
        } else {
          setTrainings((prev) => [...prev, ...data]);
        }

        setHasNextPage(data.length >= ITEMS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching trainings:", error);
        toast.show({
          message: "Failed to load trainings",
          preset: "error",
        });
      } finally {
        if (pageNumber === 1) {
          setIsLoading(false);
        } else {
          setIsFetchingNextPage(false);
        }
      }
    },
    [token, toast]
  );

  const fetchNextPage = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchTrainings(nextPage);
  }, [fetchTrainings, hasNextPage, isFetchingNextPage, page]);

  const navigateToTrainingDetails = useCallback(
    (trainingId) => {
      // Using new navigation system with TacticalScreens
      navigation.navigate("TacticalScreens", {
        screen: "TrainingScreen",
        params: { _id: trainingId },
      });
    },
    [navigation]
  );

  const navigateToCreateTraining = useCallback(() => {
    // Navigate to the training creation screen
    navigation.navigate("NewProjectScreen", {
      initialTab: "Training",
    });
  }, [navigation]);

  // Filter trainings based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTrainings(trainings);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = trainings.filter((training) =>
      training.title?.toLowerCase().includes(query)
    );

    setFilteredTrainings(filtered);
  }, [trainings, searchQuery]);

  // Initial fetch
  useEffect(() => {
    fetchTrainings(1);
  }, [fetchTrainings]);

  return {
    trainings: filteredTrainings,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    searchQuery,
    setSearchQuery,
    fetchNextPage,
    navigateToTrainingDetails,
    navigateToCreateTraining,
  };
};
