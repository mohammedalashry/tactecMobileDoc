import {useState, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useToast} from 'components/toast/toast-context';
import {taskService, Task} from '../../services/api/taskService';

interface UseTasksListOptions {
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
 * Custom hook to fetch and handle a list of tasks
 *
 * @param options Hook options
 */
export const useTasksList = (
  options: UseTasksListOptions = {useCache: true, autoFetch: true, limit: 10},
) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(options.autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [page, setPage] = useState(1);

  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();

  const fetchTasks = useCallback(
    async (params?: any) => {
      if (!token) {
        setError('No authentication token available');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await taskService.getAllTasks(
          token,
          params,
          options.useCache,
        );

        setTasks(data);
        setHasNextPage(data.length >= (options.limit || 10));
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks');
        toast.show({
          message: 'Failed to load tasks',
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
      const data = await taskService.getAllTasks(
        token,
        params,
        options.useCache,
      );

      if (data.length > 0) {
        setTasks(prevTasks => [...prevTasks, ...data]);
        setHasNextPage(data.length >= (options.limit || 10));
        setPage(nextPage);
      } else {
        setHasNextPage(false);
      }
    } catch (err) {
      console.error('Error fetching next page:', err);
      toast.show({
        message: 'Failed to load more tasks',
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
    return fetchTasks({page: 1, limit: options.limit || 10});
  }, [fetchTasks, options.limit]);

  // Fetch data on mount if autoFetch is true
  useEffect(() => {
    if (options.autoFetch) {
      fetchTasks({page: 1, limit: options.limit || 10});
    }
  }, [options.autoFetch, fetchTasks, options.limit]);

  return {
    tasks,
    isLoading,
    isFetchingNextPage,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
  };
};
