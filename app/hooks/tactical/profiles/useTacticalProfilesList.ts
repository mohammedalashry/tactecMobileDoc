import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useToast } from "components/toast/toast-context";
import { axiosInterceptor } from "utils/axios-utils";

/**
 * Custom hook for tactical role player profiles list screen
 */
export const useTacticalProfilesList = (navigation) => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const ITEMS_PER_PAGE = 20;
  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();

  /**
   * Fetch players list from API
   */
  const fetchPlayers = useCallback(
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
        const response = await axiosInterceptor({
          url: "/v1/players",
          method: "GET",
          params: {
            page: pageNumber,
            limit: ITEMS_PER_PAGE,
            search: searchQuery || undefined,
            sort: selectedSort,
            order: sortOrder,
          },
          token,
        });

        const newPlayers = response?.data?.records || [];

        // Add background colors for alternating rows
        const playersWithBg = newPlayers.map((player, index) => ({
          ...player,
          backgroundColor: index % 2 === 0 ? "#1E1E1E" : "#121212",
        }));

        if (pageNumber === 1) {
          setPlayers(playersWithBg);
        } else {
          setPlayers((prev) => [...prev, ...playersWithBg]);
        }

        setHasNextPage(newPlayers.length >= ITEMS_PER_PAGE);
        setPage(pageNumber);
      } catch (error) {
        console.error("Error fetching players:", error);
        toast.show({
          message: "Failed to load players",
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
    [token, toast, searchQuery, selectedSort, sortOrder]
  );

  /**
   * Fetch next page of players
   */
  const fetchNextPage = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) return;

    const nextPage = page + 1;
    fetchPlayers(nextPage);
  }, [fetchPlayers, hasNextPage, isFetchingNextPage, page]);

  /**
   * Navigate to player profile details
   */
  const navigateToProfileDetails = useCallback(
    (playerId) => {
      navigation.navigate("ProfileDetailsScreen", { playerId });
    },
    [navigation]
  );

  /**
   * Handle search query change
   */
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  /**
   * Handle sorting change
   */
  const handleSort = useCallback(
    (field) => {
      if (selectedSort === field) {
        // Toggle sort order if same field
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        // Set new field and default to ascending
        setSelectedSort(field);
        setSortOrder("asc");
      }
      setPage(1);
    },
    [selectedSort, sortOrder]
  );

  /**
   * Filter and sort players locally
   */
  useEffect(() => {
    // If we have a search query or sort order, filter and sort locally
    if (players.length > 0) {
      // Filter by search query if any
      let filtered = [...players];
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = players.filter(
          (player) =>
            player.name?.toLowerCase().includes(query) ||
            player.position?.toLowerCase().includes(query) ||
            player.shirtNumber?.toString().includes(query)
        );
      }

      // Apply local sorting if needed
      if (selectedSort) {
        // Custom sorting based on selected field
        filtered.sort((a, b) => {
          // Handle shirt number sorting specially for numeric comparison
          if (selectedSort === "shirtNumber") {
            const numA = parseFloat(a.shirtNumber || 0);
            const numB = parseFloat(b.shirtNumber || 0);
            return sortOrder === "asc" ? numA - numB : numB - numA;
          }

          // Handle other fields as string comparison
          const valA = (a[selectedSort] || "").toString().toLowerCase();
          const valB = (b[selectedSort] || "").toString().toLowerCase();

          if (sortOrder === "asc") {
            return valA.localeCompare(valB);
          } else {
            return valB.localeCompare(valA);
          }
        });
      }

      setFilteredPlayers(filtered);
    } else {
      setFilteredPlayers([]);
    }
  }, [players, searchQuery, selectedSort, sortOrder]);

  // Fetch initial data
  useEffect(() => {
    fetchPlayers(1);
  }, [fetchPlayers, searchQuery, selectedSort, sortOrder]);

  return {
    players: filteredPlayers,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    searchQuery,
    setSearchQuery: handleSearch,
    selectedSort,
    sortOrder,
    handleSort,
    fetchNextPage,
    navigateToProfileDetails,
    refetch: () => fetchPlayers(1),
  };
};
