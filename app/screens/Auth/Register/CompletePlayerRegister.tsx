// screens/Auth/Register/CompletePlayerRegister.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { color, padding, margin } from "theme";
import { axiosInterceptor } from "utils/axios-utils";
import { AuthRouteParams } from "navigation/types/route-params";
import { useToast } from "components/toast/toast-context";
import I18n from "i18n-js";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  ImageUploader,
  ImageData,
} from "components/shared/media/ImageUploader";

type CompletePlayerRegisterProps = NativeStackScreenProps<
  AuthRouteParams,
  "CompletePlayerRegister"
>;

// Complete player registration screen
const CompletePlayerRegister = ({
  route,
  navigation,
}: CompletePlayerRegisterProps) => {
  const toast = useToast();

  // Get params from route
  const { playerId, email } = route.params;

  // Image state
  const [profileImage, setProfileImage] = useState<ImageData | null>(null);
  const [idImage, setIdImage] = useState<ImageData | null>(null);
  const [passportImage, setPassportImage] = useState<ImageData | null>(null);
  const [covidImage, setCovidImage] = useState<ImageData | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [currentUploadType, setCurrentUploadType] = useState<string | null>(
    null
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // Handle image selection
  const handleImageSelected = (imageData: ImageData, type: string) => {
    switch (type) {
      case "profile":
        setProfileImage(imageData);
        break;
      case "id":
        setIdImage(imageData);
        break;
      case "passport":
        setPassportImage(imageData);
        break;
      case "covid":
        setCovidImage(imageData);
        break;
    }
  };

  // Upload a single image
  const uploadImage = async (
    imageData: ImageData | null,
    type: string
  ): Promise<string | null> => {
    if (!imageData) return null;

    setCurrentUploadType(type);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: imageData.uri,
        type: imageData.type,
        name: imageData.fileName || `${type}.jpg`,
      });
      formData.append("type", type);

      const response = await axiosInterceptor({
        url: `/v1/players/${playerId}/upload`,
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response?.data?.url || null;
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      return null;
    }
  };

  // Complete registration by uploading all images
  const handleCompleteRegistration = useCallback(async () => {
    if (!playerId) {
      toast.show({
        message: I18n.t("auth.registrationError"),
        preset: "error",
      });
      return;
    }

    if (!profileImage) {
      toast.show({
        message: I18n.t("auth.profileImageRequired"),
        preset: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Upload images one by one
      setUploadProgress(0);

      // Profile image (required)
      const profileUrl = await uploadImage(profileImage, "profile");
      if (!profileUrl) throw new Error(I18n.t("auth.profileUploadFailed"));
      setUploadProgress(25);

      // ID image (optional)
      await uploadImage(idImage, "id");
      setUploadProgress(50);

      // Passport image (optional)
      await uploadImage(passportImage, "passport");
      setUploadProgress(75);

      // COVID certificate (optional)
      await uploadImage(covidImage, "covid");
      setUploadProgress(100);

      // Complete registration
      await axiosInterceptor({
        url: `/v1/auth/register/player/complete`,
        method: "POST",
        data: {
          playerId,
        },
      });

      // Registration complete
      setRegistrationComplete(true);
      toast.show({
        message: I18n.t("auth.registrationSuccess"),
      });
    } catch (error) {
      console.error("Error completing registration:", error);
      toast.show({
        message: I18n.t("auth.registrationError"),
        preset: "error",
      });
    } finally {
      setIsLoading(false);
      setCurrentUploadType(null);
    }
  }, [playerId, profileImage, idImage, passportImage, covidImage, toast]);

  // If registration is complete, show success screen
  if (registrationComplete) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <MaterialIcons
              name="check-circle"
              size={80}
              color={color.success}
            />
          </View>
          <Text style={styles.successTitle}>
            {I18n.t("auth.registrationComplete")}
          </Text>
          <Text style={styles.successMessage}>
            {I18n.t("auth.registrationCompleteMessage", { email })}
          </Text>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>
              {I18n.t("auth.proceedToLogin")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color={color.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {I18n.t("auth.completeRegistration")}
          </Text>
          <View style={styles.headerRight} />
        </View>

        <Text style={styles.subtitle}>{I18n.t("auth.uploadDocuments")}</Text>

        {/* Progress indicator */}
        {isLoading && (
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressBar, { width: `${uploadProgress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>
              {currentUploadType
                ? I18n.t("auth.uploading", {
                    type: I18n.t(`auth.${currentUploadType}Image`),
                  })
                : I18n.t("auth.uploading", { type: "" })}
            </Text>
          </View>
        )}

        <View style={styles.uploadContainer}>
          {/* Profile Picture (Required) */}
          <View style={styles.uploadItem}>
            <Text style={styles.uploadLabel}>
              {I18n.t("auth.profileImage")} *
            </Text>
            <ImageUploader
              onImageSelected={(imageData) =>
                handleImageSelected(imageData, "profile")
              }
              value={profileImage?.uri}
              placeholder={
                <View style={styles.uploadPlaceholder}>
                  <MaterialIcons
                    name="person"
                    size={40}
                    color={color.primaryLight}
                  />
                  <Text style={styles.uploadPlaceholderText}>
                    {I18n.t("auth.tap")}
                  </Text>
                </View>
              }
            />
          </View>

          {/* ID Card (Optional) */}
          <View style={styles.uploadItem}>
            <Text style={styles.uploadLabel}>{I18n.t("auth.idImage")}</Text>
            <ImageUploader
              onImageSelected={(imageData) =>
                handleImageSelected(imageData, "id")
              }
              value={idImage?.uri}
              placeholder={
                <View style={styles.uploadPlaceholder}>
                  <MaterialIcons
                    name="credit-card"
                    size={40}
                    color={color.primaryLight}
                  />
                  <Text style={styles.uploadPlaceholderText}>
                    {I18n.t("auth.optional")}
                  </Text>
                </View>
              }
            />
          </View>

          {/* Passport (Optional) */}
          <View style={styles.uploadItem}>
            <Text style={styles.uploadLabel}>
              {I18n.t("auth.passportImage")}
            </Text>
            <ImageUploader
              onImageSelected={(imageData) =>
                handleImageSelected(imageData, "passport")
              }
              value={passportImage?.uri}
              placeholder={
                <View style={styles.uploadPlaceholder}>
                  <MaterialIcons
                    name="book"
                    size={40}
                    color={color.primaryLight}
                  />
                  <Text style={styles.uploadPlaceholderText}>
                    {I18n.t("auth.optional")}
                  </Text>
                </View>
              }
            />
          </View>

          {/* COVID Certificate (Optional) */}
          <View style={styles.uploadItem}>
            <Text style={styles.uploadLabel}>{I18n.t("auth.covidImage")}</Text>
            <ImageUploader
              onImageSelected={(imageData) =>
                handleImageSelected(imageData, "covid")
              }
              value={covidImage?.uri}
              placeholder={
                <View style={styles.uploadPlaceholder}>
                  <MaterialIcons
                    name="health-and-safety"
                    size={40}
                    color={color.primaryLight}
                  />
                  <Text style={styles.uploadPlaceholderText}>
                    {I18n.t("auth.optional")}
                  </Text>
                </View>
              }
            />
          </View>
        </View>

        {/* Complete Registration Button */}
        <TouchableOpacity
          style={[
            styles.completeButton,
            (!profileImage || isLoading) && styles.disabledButton,
          ]}
          onPress={handleCompleteRegistration}
          disabled={!profileImage || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={color.text} />
          ) : (
            <Text style={styles.completeButtonText}>
              {I18n.t("auth.completeRegistration")}
            </Text>
          )}
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate("Login")}
          disabled={isLoading}
        >
          <Text style={styles.loginLinkText}>{I18n.t("auth.backToLogin")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: padding.large,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: margin.medium,
  },
  backButton: {
    padding: padding.small,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: color.text,
  },
  headerRight: {
    width: 32, // Balance header layout
  },
  subtitle: {
    fontSize: 16,
    color: color.primaryLight,
    marginBottom: margin.large,
    textAlign: "center",
  },
  progressContainer: {
    marginBottom: margin.large,
  },
  progressTrack: {
    height: 8,
    backgroundColor: color.blackbg,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: color.primary,
  },
  progressText: {
    marginTop: margin.small,
    color: color.primaryLight,
    fontSize: 14,
    textAlign: "center",
  },
  uploadContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: margin.large,
  },
  uploadItem: {
    width: "48%",
    marginBottom: margin.large,
  },
  uploadLabel: {
    fontSize: 14,
    color: color.text,
    marginBottom: margin.small,
  },
  uploadPlaceholder: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: color.blackbg,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: color.border,
    borderStyle: "dashed",
  },
  uploadPlaceholderText: {
    color: color.primaryLight,
    fontSize: 14,
    marginTop: margin.small,
  },
  completeButton: {
    backgroundColor: color.primary,
    borderRadius: 8,
    paddingVertical: padding.medium,
    alignItems: "center",
    marginBottom: margin.medium,
  },
  disabledButton: {
    opacity: 0.5,
  },
  completeButtonText: {
    color: color.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    alignItems: "center",
    marginTop: margin.small,
  },
  loginLinkText: {
    color: color.primary,
    fontSize: 16,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: padding.large,
  },
  successIconContainer: {
    marginBottom: margin.large,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: color.text,
    marginBottom: margin.medium,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    color: color.primaryLight,
    textAlign: "center",
    marginBottom: margin.large,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: color.primary,
    borderRadius: 8,
    paddingVertical: padding.medium,
    paddingHorizontal: padding.large,
    alignItems: "center",
  },
  loginButtonText: {
    color: color.text,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CompletePlayerRegister;
