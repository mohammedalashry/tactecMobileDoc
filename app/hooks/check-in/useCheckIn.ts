import {useState, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useToast} from 'components/toast/toast-context';
import {checkInService} from '../../services/api/checkInService';

/**
 * Custom hook to handle check-in functionality
 */
export const useCheckIn = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();

  const processQRCode = useCallback(
    async (qrData: string) => {
      if (!token || isProcessing) {
        return;
      }

      setIsProcessing(true);
      setScanResult(null);

      try {
        // Parse QR code data
        let parsedData;
        try {
          parsedData = JSON.parse(qrData);
        } catch (e) {
          throw new Error('Invalid QR code format');
        }

        // Check if the QR code contains the expected data
        if (!parsedData._id || !parsedData.date) {
          throw new Error('Invalid QR code content');
        }

        // Submit check-in
        const result = await checkInService.submitCheckIn(
          {
            qrCodeId: parsedData._id,
            qrCodeDate: new Date(parsedData.date),
          },
          token,
        );

        if (result.success) {
          setScanResult({success: true, message: result.message});
          toast.show({message: result.message});
        } else {
          setScanResult({success: false, message: result.message});
          toast.show({message: result.message, preset: 'error'});
        }
      } catch (error: any) {
        console.error('Error processing QR code:', error);
        setScanResult({
          success: false,
          message: error.message || 'Failed to process QR code',
        });
        toast.show({
          message: error.message || 'Failed to process QR code',
          preset: 'error',
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [token, isProcessing, toast],
  );

  const resetScan = useCallback(() => {
    setScanResult(null);
  }, []);

  return {
    isProcessing,
    scanResult,
    processQRCode,
    resetScan,
  };
};
