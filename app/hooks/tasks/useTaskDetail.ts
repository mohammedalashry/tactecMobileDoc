import {useState, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useToast} from 'components/toast/toast-context';
import {taskService, Task} from '../../services/api/taskService';
import {ImageData} from '../../components/shared/media/ImageUploader';

interface UseTaskDetailOptions {
  /**
   * Whether to use cache for data fetching
   */
  useCache?: boolean;

  /**
   * Whether to fetch data automatically on mount
   */
  autoFetch?: boolean;
}

/**
 * Custom hook to fetch and handle a single task
 *
 * @param taskId ID of the task to fetch
 * @param options Hook options
 */
export const useTaskDetail = (
  route: any,
  options: UseTaskDetailOptions = {useCache: true, autoFetch: true},
) => {
  const taskId = route?.params?._id;

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(!!taskId && options.autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();

  const fetchTask = useCallback(
    async (forceRefresh: boolean = false) => {
      if (!taskId || !token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // If forceRefresh is true, bypass cache
        const useCache = options.useCache && !forceRefresh;
        const response = await taskService.getTaskById(taskId, token, useCache);
        setTask(response.data);
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Failed to load task details');
        toast.show({
          message: 'Failed to load task details',
          preset: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [taskId, token, options.useCache, toast],
  );

  const uploadImage = useCallback(
    async (image: ImageData) => {
      if (!taskId || !token || !task) {
        return null;
      }

      try {
        const result = await taskService.uploadTaskImage(taskId, image, token);
        // Refresh the task to include the new image
        fetchTask();
        return result.url;
      } catch (err) {
        console.error('Error uploading image:', err);
        toast.show({
          message: 'Failed to upload image',
          preset: 'error',
        });
        return null;
      }
    },
    [taskId, token, task, fetchTask, toast],
  );

  const updateImageDescription = useCallback(
    async (index: number, description: string) => {
      if (!taskId || !token || !task?.images) {
        return;
      }

      try {
        const updatedImages = [...task.images];
        updatedImages[index] = {
          ...updatedImages[index],
          description,
        };

        await taskService.updateTaskImages(taskId, updatedImages, token);
        fetchTask();
      } catch (err) {
        console.error('Error updating image description:', err);
        toast.show({
          message: 'Failed to update image description',
          preset: 'error',
        });
      }
    },
    [taskId, token, task, fetchTask, toast],
  );

  // Fetch data on mount if autoFetch is true
  useEffect(() => {
    if (options.autoFetch && taskId) {
      fetchTask();
    }
  }, [taskId, options.autoFetch, fetchTask]);

  return {
    task,
    isLoading,
    error,
    activeSlide,
    setActiveSlide,
    refetch: fetchTask,
    uploadImage,
    updateImageDescription,
  };
};
