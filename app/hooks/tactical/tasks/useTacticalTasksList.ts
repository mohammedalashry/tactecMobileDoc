import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useToast } from "components/toast/toast-context";
import { taskService, Task } from "services/api/taskService";

/**
 * Custom hook for tactical role tasks list screen
 */
export const useTacticalTasksList = (navigation) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const ITEMS_PER_PAGE = 10;
  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();

  const fetchTasks = useCallback(
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
          category: "tactical", // Filter for tactical category tasks
        };

        const data = await taskService.getAllTasks(token, params);

        if (pageNumber === 1) {
          setTasks(data);
        } else {
          setTasks((prev) => [...prev, ...data]);
        }

        setHasNextPage(data.length >= ITEMS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.show({
          message: "Failed to load tasks",
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
    fetchTasks(nextPage);
  }, [fetchTasks, hasNextPage, isFetchingNextPage, page]);

  const navigateToTaskDetails = useCallback(
    (taskId) => {
      // Using new navigation system with TacticalScreens
      navigation.navigate("TacticalScreens", {
        screen: "TaskScreen",
        params: { _id: taskId },
      });
    },
    [navigation]
  );

  const navigateToCreateTask = useCallback(() => {
    // Navigate to the task creation screen
    navigation.navigate("NewProjectScreen", {
      initialTab: "Task",
    });
  }, [navigation]);

  // Filter tasks based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTasks(tasks);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tasks.filter((task) =>
      task.title?.toLowerCase().includes(query)
    );

    setFilteredTasks(filtered);
  }, [tasks, searchQuery]);

  // Initial fetch
  useEffect(() => {
    fetchTasks(1);
  }, [fetchTasks]);

  return {
    tasks: filteredTasks,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    searchQuery,
    setSearchQuery,
    fetchNextPage,
    navigateToTaskDetails,
    navigateToCreateTask,
  };
};
