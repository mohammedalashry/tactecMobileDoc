import {useState, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useToast} from 'components/toast/toast-context';
import {trainingService, Training} from '../../services/api/trainingService';

interface UseTrainingsListOptions {
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
 * Custom hook to fetch and handle a list of trainings
 *
 * @param options Hook options
 */
export const useTrainingsList = (
  options: UseTrainingsListOptions = {
    useCache: true,
    autoFetch: true,
    limit: 10,
  },
) => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(options.autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [page, setPage] = useState(1);

  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();

  const fetchTrainings = useCallback(
    async (params?: any) => {
      if (!token) {
        setError('No authentication token available');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await trainingService.getAllTrainings(
          token,
          params,
          options.useCache,
        );

        setTrainings(data);
        setHasNextPage(data.length >= (options.limit || 10));
      } catch (err) {
        console.error('Error fetching trainings:', err);
        setError('Failed to load trainings');
        toast.show({
          message: 'Failed to load trainings',
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
      const data = await trainingService.getAllTrainings(
        token,
        params,
        options.useCache,
      );

      if (data.length > 0) {
        setTrainings(prevTrainings => [...prevTrainings, ...data]);
        setHasNextPage(data.length >= (options.limit || 10));
        setPage(nextPage);
      } else {
        setHasNextPage(false);
      }
    } catch (err) {
      console.error('Error fetching next page:', err);
      toast.show({
        message: 'Failed to load more trainings',
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
    return fetchTrainings({page: 1, limit: options.limit || 10});
  }, [fetchTrainings, options.limit]);

  // Fetch data on mount if autoFetch is true
  useEffect(() => {
    if (options.autoFetch) {
      fetchTrainings({page: 1, limit: options.limit || 10});
    }
  }, [options.autoFetch, fetchTrainings, options.limit]);

  return {
    trainings,
    isLoading,
    isFetchingNextPage,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
  };
};
