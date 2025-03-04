import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {color} from 'theme';
import {DetailScreen} from 'components/shared/layout/DetailScreen';
import {Alert} from 'components/shared/alerts/Alert';
import {useCheckIn} from 'hooks/check-in/useCheckIn';
import I18n from 'i18n-js';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';
import {runOnJS} from 'react-native-reanimated';

const PlayerCheckInScreen = ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const {isProcessing, scanResult, processQRCode, resetScan} = useCheckIn();

  const devices = useCameraDevices();
  const device = devices.back;
  const isFocused = useIsFocused();

  // Request camera permission on mount
  useEffect(() => {
    const requestPermission = async () => {
      setIsInitializing(true);
      try {
        const status = await Camera.requestCameraPermission();
        setHasPermission(status === 'authorized');
      } catch (error) {
        console.error('Error requesting camera permission:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    requestPermission();
  }, []);

  // Frame processor for QR code scanning
  const frameProcessor = useCallback(
    frame => {
      'worklet';
      if (isProcessing) return;

      // This would normally use vision-camera-code-scanner, but we'll simulate it
      // In a real implementation, we would use:
      // const barcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE]);
      // if (barcodes.length > 0 && barcodes[0]?.content?.data) {
      //   runOnJS(processQRCode)(barcodes[0].content.data);
      // }

      // For the mock implementation, we'll simulate scanning after a delay
      if (Math.random() < 0.01) {
        // Simulate occasional successful scan
        const mockQRData = JSON.stringify({
          _id: 'qr123456',
          date: new Date().toISOString(),
        });
        runOnJS(processQRCode)(mockQRData);
      }
    },
    [isProcessing, processQRCode],
  );

  // Handle scan result
  useEffect(() => {
    if (scanResult && scanResult.success) {
      navigation.navigate('CheckInResult', {result: scanResult});
    }
  }, [scanResult, navigation]);

  const handleManualCheckIn = () => {
    navigation.navigate('ManualCheckIn');
  };

  if (isInitializing) {
    return (
      <DetailScreen
        title={I18n.t('checkIn.scanQR')}
        loading={false}
        showBackButton={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.primary} />
          <Text style={styles.loadingText}>{I18n.t('common.loading')}</Text>
        </View>
      </DetailScreen>
    );
  }

  if (!hasPermission) {
    return (
      <DetailScreen
        title={I18n.t('checkIn.scanQR')}
        loading={false}
        showBackButton={true}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            {I18n.t('checkIn.cameraPermission')}
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={async () => {
              const status = await Camera.requestCameraPermission();
              setHasPermission(status === 'authorized');
            }}>
            <Text style={styles.permissionButtonText}>
              {I18n.t('checkIn.grantPermission')}
            </Text>
          </TouchableOpacity>
        </View>
      </DetailScreen>
    );
  }

  return (
    <DetailScreen
      title={I18n.t('checkIn.scanQR')}
      loading={false}
      showBackButton={true}>
      <View style={styles.container}>
        <Text style={styles.instructions}>
          {I18n.t('checkIn.instructions')}
        </Text>

        <View style={styles.cameraContainer}>
          {device != null && isFocused ? (
            <Camera
              style={styles.camera}
              device={device}
              isActive={isFocused && !isProcessing}
              frameProcessor={frameProcessor}
              frameProcessorFps={5}
            />
          ) : (
            <View style={styles.cameraPlaceholder}>
              <Text style={styles.cameraPlaceholderText}>
                {I18n.t('checkIn.cameraNotAvailable')}
              </Text>
            </View>
          )}

          {isProcessing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color={color.primary} />
              <Text style={styles.processingText}>
                {I18n.t('checkIn.processing')}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.manualButton}
          onPress={handleManualCheckIn}>
          <Text style={styles.manualButtonText}>
            {I18n.t('checkIn.manualCheckIn')}
          </Text>
        </TouchableOpacity>

        {scanResult && !scanResult.success && (
          <Alert
            isVisible={true}
            title={I18n.t('checkIn.scanFailed')}
            message={scanResult.message}
            primaryButtonText={I18n.t('common.tryAgain')}
            onPrimaryAction={resetScan}
            onDismiss={resetScan}
            type="error"
          />
        )}
      </View>
    </DetailScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: color.text,
    fontSize: 16,
    marginTop: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    color: color.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: color.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  permissionButtonText: {
    color: color.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructions: {
    color: color.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  cameraContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: color.blackbg,
    position: 'relative',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  cameraPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.blackbg,
  },
  cameraPlaceholderText: {
    color: color.text,
    fontSize: 16,
    textAlign: 'center',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: color.text,
    fontSize: 16,
    marginTop: 16,
  },
  manualButton: {
    marginTop: 24,
    backgroundColor: color.blackbg,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: color.line,
  },
  manualButtonText: {
    color: color.text,
    fontSize: 16,
  },
});

export default PlayerCheckInScreen;
