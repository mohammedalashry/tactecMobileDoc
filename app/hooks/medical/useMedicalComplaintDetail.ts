import {useState, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useToast} from 'components/toast/toast-context';
import {
  medicalComplaintService,
  MedicalComplaint,
} from '../../services/api/medicalComplaintService';

/**
 * Custom hook to fetch and handle a single medical complaint
 *
 * @param complaintId ID of the medical complaint to fetch
 * @param options Hook options
 */
export const useMedicalComplaintDetail = (
  complaintId: string | undefined,
  options = {useCache: true, autoFetch: true},
) => {
  const [complaint, setComplaint] = useState<MedicalComplaint | null>(null);
  const [isLoading, setIsLoading] = useState(
    !!complaintId && options.autoFetch,
  );
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();

  const fetchComplaint = useCallback(
    async (forceRefresh: boolean = false) => {
      if (!complaintId || !token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // If forceRefresh is true, bypass cache
        const useCache = options.useCache && !forceRefresh;
        const data = await medicalComplaintService.getById(
          complaintId,
          token,
          useCache,
        );
        setComplaint(data);
      } catch (err) {
        console.error('Error fetching medical complaint:', err);
        setError('Failed to load complaint details');
        toast.show({
          message: 'Failed to load complaint details',
          preset: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [complaintId, token, options.useCache, toast],
  );

  // Fetch data on mount if autoFetch is true
  useEffect(() => {
    if (options.autoFetch && complaintId) {
      fetchComplaint();
    }
  }, [complaintId, options.autoFetch, fetchComplaint]);

  return {
    complaint,
    isLoading,
    error,
    refetch: fetchComplaint,
  };
};
