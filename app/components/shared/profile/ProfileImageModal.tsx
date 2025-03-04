import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { color } from "theme";
import I18n from "i18n-js";
import {
  ImageUploader,
  ImageData,
} from "components/shared/media/ImageUploader";
import ImagePicker from "react-native-image-crop-picker";

interface ProfileImageModalProps {
  isVisible: boolean;
  onClose: () => void;
  imageType: "profile" | "id" | "passport" | "covid" | null;
  currentImageUrl: string | null;
  onImageSelected: (
    imageData: ImageData,
    type: "profile" | "id" | "passport" | "covid"
  ) => void;
}

/**
 * Modal for selecting and uploading profile-related images
 */
export const ProfileImageModal: React.FC<ProfileImageModalProps> = ({
  isVisible,
  onClose,
  imageType,
  currentImageUrl,
  onImageSelected,
}) => {
  if (!imageType) return null;

  // Get display name for image type
  const getImageTypeLabel = () => {
    switch (imageType) {
      case "profile":
        return "Profile Picture";
      case "id":
        return "ID Photo";
      case "passport":
        return "Passport Photo";
      case "covid":
        return "COVID Certificate";
      default:
        return "Image";
    }
  };

  // Handle image selection
  const handleImageSelect = async (imageData: ImageData) => {
    if (!imageType) return;

    onImageSelected(imageData, imageType);
    onClose();
  };

  // Open image picker
  const pickImage = async () => {
    try {
      const result = await ImagePicker.openPicker({
        width: 500,
        height: 500,
        cropping: imageType === "profile",
        cropperCircleOverlay: imageType === "profile",
        includeBase64: true,
        mediaType: "photo",
      });

      if (result?.path) {
        const imageData: ImageData = {
          uri: `data:${result.mime};base64,${result.data}`,
          type: result.mime || "image/jpeg",
          name: result.filename || `${imageType}-${Date.now()}.jpg`,
        };

        handleImageSelect(imageData);
      }
    } catch (error) {
      console.log("Image selection cancelled or error", error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {`Update ${getImageTypeLabel()}`}
              </Text>

              <ImageUploader
                imageUrl={currentImageUrl || undefined}
                onImageSelected={handleImageSelect}
                placeholder={
                  <Text style={styles.placeholderText}>
                    {I18n.t("common.tapToSelect")}
                  </Text>
                }
                imageHeight={200}
                imageWidth={imageType === "profile" ? 200 : 300}
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.buttonText}>
                    {I18n.t("common.cancel")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={pickImage}
                >
                  <Text style={styles.buttonText}>
                    {I18n.t("common.selectImage")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: color.background,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    color: color.text,
    fontWeight: "bold",
    marginBottom: 20,
  },
  placeholderText: {
    color: color.text,
    fontSize: 14,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: color.blackbg,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: color.line,
    minWidth: 120,
    alignItems: "center",
  },
  selectButton: {
    backgroundColor: color.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 120,
    alignItems: "center",
  },
  buttonText: {
    color: color.text,
    fontSize: 14,
    fontWeight: "600",
  },
});
