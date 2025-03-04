import {useState, useEffect, useCallback, useRef} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useToast} from 'components/toast/toast-context';
import {matchService, Match} from '../../services/api/matchService';

interface UseMatchesListOptions {
  /**
   * Whether to use cache for data fetching
   */
  useCache?: boolean;

  /**
   * Whether to fetch data automatically on mount
   */
  autoFetch?: boolean;

  /**
   * Initial pagination limit
   */
  limit?: number;
}

/**
 * Custom hook to fetch and handle a list of matches
 *
 * @param options Hook options
 */
export const useMatchesList = (
  options: UseMatchesListOptions = {useCache: true, autoFetch: true, limit: 10},
) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(options.autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [currentMatchDate, setCurrentMatchDate] = useState('');

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
      onViewableItemsChanged: ({viewableItems}) => {
        if (viewableItems.length > 0) {
          const firstItem = viewableItems[0].item;
          const date = new Date(firstItem.date);
          setCurrentMatchDate(
            date.toLocaleString('default', {month: 'long', year: 'numeric'}),
          );
        }
      },
    },
  ]);

  const fetchMatches = useCallback(
    async (params?: any) => {
      if (!token) {
        setError('No authentication token available');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await matchService.getAllMatches(
          token,
          params,
          options.useCache,
        );

        setMatches(data);

        // Set initial current match date
        if (data.length > 0) {
          const date = new Date(data[0].date);
          setCurrentMatchDate(
            date.toLocaleString('default', {month: 'long', year: 'numeric'}),
          );
        }

        setHasNextPage(data.length >= (options.limit || 10));
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Failed to load matches');
        toast.show({
          message: 'Failed to load matches',
          preset: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [token, options.useCache, options.limit, toast],
  );

  const fetchNextPage = useCallback(async () => {
    if (isFetchingNextPage || !hasNextPage || !token) return;

    setIsFetchingNextPage(true);

    try {
      const nextPage = page + 1;
      const params = {page: nextPage, limit: options.limit || 10};
      const data = await matchService.getAllMatches(
        token,
        params,
        options.useCache,
      );

      if (data.length > 0) {
        setMatches(prevMatches => [...prevMatches, ...data]);
        setHasNextPage(data.length >= (options.limit || 10));
        setPage(nextPage);
      } else {
        setHasNextPage(false);
      }
    } catch (err) {
      console.error('Error fetching next page:', err);
      toast.show({
        message: 'Failed to load more matches',
        preset: 'error',
      });
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [
    token,
    page,
    options.useCache,
    options.limit,
    hasNextPage,
    isFetchingNextPage,
    toast,
  ]);

  const refetch = useCallback(() => {
    setPage(1);
    return fetchMatches({page: 1, limit: options.limit || 10});
  }, [fetchMatches, options.limit]);

  // Fetch data on mount if autoFetch is true
  useEffect(() => {
    if (options.autoFetch) {
      fetchMatches({page: 1, limit: options.limit || 10});
    }
  }, [options.autoFetch, fetchMatches, options.limit]);

  return {
    matches,
    currentMatchDate,
    isLoading,
    loadDynamicMatches: isLoading, // Alias for backward compatibility
    isFetchingNextPage,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
    viewabilityConfigCallbackPairs: viewabilityConfigCallbackPairs.current,
  };
};
