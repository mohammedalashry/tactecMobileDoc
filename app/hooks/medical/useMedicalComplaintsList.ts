import {useState, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useToast} from 'components/toast/toast-context';
import {
  medicalComplaintService,
  MedicalComplaint,
} from '../../services/api/medicalComplaintService';

interface UseMedicalComplaintsListOptions {
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
 * Custom hook to fetch and handle a list of medical complaints
 *
 * @param options Hook options
 */
export const useMedicalComplaintsList = (
  options: UseMedicalComplaintsListOptions = {useCache: true, autoFetch: true},
) => {
  const [complaints, setComplaints] = useState<MedicalComplaint[]>([]);
  const [isLoading, setIsLoading] = useState(options.autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(
    null,
  );
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [isShowConfirmation, setIsShowConfirmation] = useState(false);
  const [newComplaintText, setNewComplaintText] = useState('');

  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();

  const fetchComplaints = useCallback(async () => {
    if (!token) {
      setError('No authentication token available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await medicalComplaintService.getAll(
        token,
        options.useCache,
      );
      setComplaints(data);
    } catch (err) {
      console.error('Error fetching medical complaints:', err);
      setError('Failed to load medical complaints');
      toast.show({
        message: 'Failed to load medical complaints',
        preset: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, options.useCache, toast]);

  const sendComplaint = useCallback(async () => {
    if (!token || !newComplaintText.trim()) {
      return false;
    }

    try {
      await medicalComplaintService.create(
        {description: newComplaintText.trim()},
        token,
      );
      setNewComplaintText('');
      setShowSendDialog(false);
      setIsShowConfirmation(true);
      await fetchComplaints();
      return true;
    } catch (err) {
      console.error('Error sending medical complaint:', err);
      toast.show({
        message: 'Failed to send medical complaint',
        preset: 'error',
      });
      return false;
    }
  }, [token, newComplaintText, fetchComplaints, toast]);

  const closeConfirmation = useCallback(() => {
    setIsShowConfirmation(false);
  }, []);

  // Fetch data on mount if autoFetch is true
  useEffect(() => {
    if (options.autoFetch) {
      fetchComplaints();
    }
  }, [options.autoFetch, fetchComplaints]);

  return {
    complaints,
    isLoading,
    error,
    selectedComplaintId,
    setSelectedComplaintId,
    showSendDialog,
    setShowSendDialog,
    isShowConfirmation,
    setIsShowConfirmation,
    newComplaintText,
    setNewComplaintText,
    fetchComplaints,
    sendComplaint,
    closeConfirmation,
  };
};
