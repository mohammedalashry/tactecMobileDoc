import {useState, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useToast} from 'components/toast/toast-context';
import {trainingService, Training} from '../../services/api/trainingService';
import {ImageData} from '../../components/shared/media/ImageUploader';

interface UseTrainingDetailOptions {
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
 * Custom hook to fetch and handle a single training
 *
 * @param route Route object containing training ID
 * @param options Hook options
 */
export const useTrainingDetail = (
  route: any,
  options: UseTrainingDetailOptions = {useCache: true, autoFetch: true},
) => {
  const trainingId = route?.params?._id;

  const [training, setTraining] = useState<Training | null>(null);
  const [isLoading, setIsLoading] = useState(!!trainingId && options.autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();

  const fetchTraining = useCallback(
    async (forceRefresh: boolean = false) => {
      if (!trainingId || !token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // If forceRefresh is true, bypass cache
        const useCache = options.useCache && !forceRefresh;
        const data = await trainingService.getTrainingById(
          trainingId,
          token,
          useCache,
        );
        setTraining(data);
      } catch (err) {
        console.error('Error fetching training:', err);
        setError('Failed to load training details');
        toast.show({
          message: 'Failed to load training details',
          preset: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [trainingId, token, options.useCache, toast],
  );

  const uploadImage = useCallback(
    async (image: ImageData) => {
      if (!trainingId || !token || !training) {
        return null;
      }

      try {
        const result = await trainingService.uploadTrainingImage(
          trainingId,
          image,
          token,
        );
        // Refresh the training to include the new image
        fetchTraining();
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
    [trainingId, token, training, fetchTraining, toast],
  );

  const updateImageDescription = useCallback(
    async (index: number, description: string) => {
      if (!trainingId || !token || !training?.images) {
        return;
      }

      try {
        const updatedImages = [...training.images];
        updatedImages[index] = {
          ...updatedImages[index],
          description,
        };

        await trainingService.updateTrainingImages(
          trainingId,
          updatedImages,
          token,
        );
        fetchTraining();
      } catch (err) {
        console.error('Error updating image description:', err);
        toast.show({
          message: 'Failed to update image description',
          preset: 'error',
        });
      }
    },
    [trainingId, token, training, fetchTraining, toast],
  );

  // Fetch data on mount if autoFetch is true
  useEffect(() => {
    if (options.autoFetch && trainingId) {
      fetchTraining();
    }
  }, [trainingId, options.autoFetch, fetchTraining]);

  return {
    training,
    isLoading,
    error,
    activeSlide,
    setActiveSlide,
    fetchTraining,
    uploadImage,
    updateImageDescription,
  };
};
