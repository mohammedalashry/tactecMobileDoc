// components/shared/media/ImageUploader.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import I18n from 'i18n-js';
import {color, padding, typography, margin} from 'theme';

export interface ImageData {
  uri: string;
  type?: string;
  name?: string;
}

interface ImageUploaderProps {
  imageUrl?: string;
  onImageSelected: (imageData: ImageData) => void;
  onImageUpload?: (imageData: ImageData) => Promise<string>;
  placeholder?: React.ReactNode;
  description?: string;
  onDescriptionChange?: (text: string) => void;
  showDescription?: boolean;
  loading?: boolean;
  imageHeight?: number;
  imageWidth?: number;
}

export const ImageUploader = ({
  imageUrl,
  onImageSelected,
  onImageUpload,
  placeholder,
  description,
  onDescriptionChange,
  showDescription = false,
  loading = false,
  imageHeight = 135,
  imageWidth = 200,
}: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.openPicker({
        width: 0,
        height: 0,
        includeBase64: true,
        mediaType: 'photo',
      });

      if (result?.path) {
        const imageData: ImageData = {
          uri: `data:${result.mime};base64,${result.data}`,
          type: `image/${result.path.split('.').pop()}`,
          name:
            result.filename ||
            `image-${Date.now()}.${result.path.split('.').pop()}`,
        };

        // Call the onImageSelected callback with the image data
        onImageSelected(imageData);
        setUploadError(null);

        // If there's an upload function, call it
        if (onImageUpload) {
          setUploading(true);
          try {
            const uploadedUrl = await onImageUpload(imageData);
            setUploadedImageUrl(uploadedUrl);
            // If the upload was successful, we could do something with the URL
            // like updating the component state or triggering another action
          } catch (error) {
            console.error('Error uploading image:', error);
            setUploadError(
              typeof error === 'string'
                ? error
                : 'Failed to upload image. Please try again.',
            );
          } finally {
            setUploading(false);
          }
        }
      }
    } catch (err: any) {
      // User cancelled or error
      console.log('Image selection cancelled or error', err);
      if (err && err.message !== 'User cancelled image selection') {
        setUploadError('Failed to select image. Please try again.');
      }
    }
  };

  const renderImage = () => {
    if (loading || uploading) {
      return (
        <View
          style={[
            styles.imageContainer,
            {height: imageHeight, width: imageWidth},
          ]}>
          <ActivityIndicator color={color.primary} size="large" />
        </View>
      );
    }

    // Use uploaded URL if available, otherwise use the provided imageUrl
    const displayUrl = uploadedImageUrl || imageUrl;

    if (displayUrl) {
      return (
        <Image
          source={{uri: displayUrl}}
          style={[styles.image, {height: imageHeight, width: imageWidth}]}
          resizeMode="contain"
        />
      );
    }

    return (
      <View
        style={[
          styles.imageContainer,
          {height: imageHeight, width: imageWidth},
        ]}>
        {placeholder || (
          <Text style={styles.placeholderText}>
            {I18n.t('Tactec.UploadImage')}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePickImage}
        disabled={loading || uploading}>
        {renderImage()}
      </TouchableOpacity>

      {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}

      {showDescription && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.label}>{I18n.t('Home.Description')}</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={onDescriptionChange}
            placeholder={I18n.t('Home.Description')}
            placeholderTextColor={color.line}
            multiline
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: margin.medium,
  },
  imageContainer: {
    backgroundColor: color.uploadImgbg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: color.border,
  },
  image: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  placeholderText: {
    color: color.text,
    fontSize: 14,
    fontFamily: typography.primary,
  },
  descriptionContainer: {
    width: '80%',
    marginTop: margin.medium,
  },
  label: {
    fontSize: 14,
    fontFamily: typography.primary,
    color: color.text,
    marginBottom: margin.tiny,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: 10,
    color: color.text,
    padding: padding.medium,
    height: 80,
    textAlignVertical: 'top',
    backgroundColor: color.primarybg,
    fontFamily: typography.primary,
  },
  errorText: {
    color: 'red',
    marginTop: margin.small,
    fontSize: 12,
    fontFamily: typography.primary,
  },
});
