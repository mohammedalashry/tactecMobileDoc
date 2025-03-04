import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useToast } from "components/toast/toast-context";
import { matchService, Match } from "services/api/matchService";

/**
 * Custom hook for tactical role matches list screen
 */
export const useTacticalMatchesList = (navigation) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMatchDate, setCurrentMatchDate] = useState("");

  const ITEMS_PER_PAGE = 10;
  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();

  // Create a ref for viewability configuration
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  });

  // Create a ref for viewability callbacks
  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: viewabilityConfig.current,
      onViewableItemsChanged: ({ viewableItems }) => {
        if (viewableItems.length > 0) {
          const firstItem = viewableItems[0].item;
          const date = new Date(firstItem.date);
          setCurrentMatchDate(
            date.toLocaleString("default", { month: "long", year: "numeric" })
          );
        }
      },
    },
  ]);

  const fetchMatches = useCallback(
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
        };

        const data = await matchService.getAllMatches(token, params);

        if (pageNumber === 1) {
          setMatches(data);
        } else {
          setMatches((prev) => [...prev, ...data]);
        }

        // Set initial current match date if it's the first page and we have data
        if (pageNumber === 1 && data.length > 0) {
          const date = new Date(data[0].date);
          setCurrentMatchDate(
            date.toLocaleString("default", { month: "long", year: "numeric" })
          );
        }

        setHasNextPage(data.length >= ITEMS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching matches:", error);
        toast.show({
          message: "Failed to load matches",
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
    fetchMatches(nextPage);
  }, [fetchMatches, hasNextPage, isFetchingNextPage, page]);

  const navigateToMatchDetails = useCallback(
    (matchId) => {
      // Using new navigation system with TacticalScreens
      navigation.navigate("TacticalScreens", {
        screen: "MatchScreen",
        params: { _id: matchId },
      });
    },
    [navigation]
  );

  const navigateToCreateMatch = useCallback(() => {
    // Navigate to the match creation screen
    navigation.navigate("NewProjectScreen");
  }, [navigation]);

  // Filter matches based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMatches(matches);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = matches.filter(
      (match) =>
        match.title?.toLowerCase().includes(query) ||
        match.opponent?.toLowerCase().includes(query)
    );

    setFilteredMatches(filtered);
  }, [matches, searchQuery]);

  // Initial fetch
  useEffect(() => {
    fetchMatches(1);
  }, [fetchMatches]);

  return {
    matches: filteredMatches,
    currentMatchDate,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    searchQuery,
    setSearchQuery,
    fetchNextPage,
    navigateToMatchDetails,
    navigateToCreateMatch,
    viewabilityConfigCallbackPairs: viewabilityConfigCallbackPairs.current,
  };
};
