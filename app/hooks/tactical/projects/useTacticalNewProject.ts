import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useToast } from "components/toast/toast-context";
import { axiosInterceptor } from "utils/axios-utils";
import ImagePicker from "react-native-image-crop-picker";
import { Platform } from "react-native";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import RNFS from "react-native-fs";
import I18n from "i18n-js";
import { parseFormDateTime } from "utils/dateTime";

/**
 * Custom hook for the NewProjectScreen with image compression
 */
export const useTacticalNewProject = (route, navigation) => {
  const initialEvent = route?.params?.eventType || I18n.t("Tactec.Match");
  const initialImages = route?.params?.eventImgs || [];

  // State
  const [eventType, setEventType] = useState(initialEvent);
  const [title, setTitle] = useState("");
  const [leagueData, setLeagueData] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [images, setImages] = useState(initialImages);
  const [activeSlide, setActiveSlide] = useState(0);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [compressionVisible, setCompressionVisible] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Date/time state
  const [dateTimeValues, setDateTimeValues] = useState({
    day: new Date().getDate().toString(),
    month: (new Date().getMonth() + 1).toString(),
    year: new Date().getFullYear().toString(),
    hours:
      new Date().getHours() > 12
        ? (new Date().getHours() - 12).toString()
        : new Date().getHours().toString(),
    minutes: new Date().getMinutes().toString().padStart(2, "0"),
    ampm: new Date().getHours() >= 12 ? "pm" : "am",
  });

  // Selectors
  const token = useSelector((state: RootState) => state.login.accessToken);
  const homeTeam = useSelector((state: RootState) => state.matches.homeTeam);
  const awayTeam = useSelector((state: RootState) => state.matches.team);
  const teamId = process.env.TEAM_ID;
  const toast = useToast();

  /**
   * Compress image to reduce upload size
   * @param {Object} image Image object from picker
   * @returns {Promise<Object>} Compressed image data
   */
  const compressImage = useCallback(async (image) => {
    setCompressionVisible(true);
    setCompressionProgress(0.1);

    try {
      // Get image dimensions
      const { width, height, path, mime } = image;

      // Determine compression quality based on file size
      let quality = 0.8;
      const stats = await RNFS.stat(path);
      const fileSizeInMB = stats.size / (1024 * 1024);

      if (fileSizeInMB > 5) quality = 0.6;
      if (fileSizeInMB > 10) quality = 0.4;

      setCompressionProgress(0.3);

      // Calculate target dimensions (max 1920x1080)
      let targetWidth = width;
      let targetHeight = height;
      const MAX_WIDTH = 1920;
      const MAX_HEIGHT = 1080;

      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = width / height;
        if (width > height) {
          targetWidth = MAX_WIDTH;
          targetHeight = Math.round(MAX_WIDTH / ratio);
        } else {
          targetHeight = MAX_HEIGHT;
          targetWidth = Math.round(MAX_HEIGHT * ratio);
        }
      }

      setCompressionProgress(0.5);

      // Create compressed image name
      const timestamp = new Date().getTime();
      const newPath = `${RNFS.CachesDirectoryPath}/compressed_${timestamp}.jpg`;

      // Perform image manipulation
      await manipulateAsync(
        path,
        [{ resize: { width: targetWidth, height: targetHeight } }],
        { format: SaveFormat.JPEG, compress: quality }
      ).then(async (result) => {
        // Move the manipulated image to our cache location
        if (Platform.OS === "ios") {
          await RNFS.copyFile(result.uri.replace("file://", ""), newPath);
        } else {
          await RNFS.copyFile(result.uri, newPath);
        }
      });

      setCompressionProgress(0.8);

      // Read the compressed file
      const base64 = await RNFS.readFile(newPath, "base64");

      setCompressionProgress(1.0);

      // Return the compressed image data
      return {
        uri: `data:${mime};base64,${base64}`,
        type: mime,
        name: `image_${timestamp}.jpg`,
        width: targetWidth,
        height: targetHeight,
      };
    } catch (error) {
      console.error("Image compression error:", error);
      // If compression fails, return original image
      return {
        uri: `data:${image.mime};base64,${image.data}`,
        type: image.mime,
        name: `image_${Date.now()}.jpg`,
      };
    } finally {
      setCompressionVisible(false);
    }
  }, []);

  /**
   * Handle image upload
   */
  const handleImageUpload = useCallback(async () => {
    setUploadModalVisible(false);

    try {
      const pickerResult = await ImagePicker.openPicker({
        width: 1920,
        height: 1080,
        cropping: true,
        includeBase64: true,
        mediaType: "photo",
        compressImageQuality: 0.8,
      });

      if (pickerResult) {
        // Compress the image
        const compressedImage = await compressImage(pickerResult);

        // Upload the compressed image to server
        setIsLoading(true);

        const formData = new FormData();
        formData.append("file", {
          uri: compressedImage.uri,
          type: compressedImage.type,
          name: compressedImage.name,
        });

        const response = await fetch(
          `${process.env.API_URL}/v1/uploads/upload-image`,
          {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const data = await response.json();

        if (data.url) {
          // Add the new image to the images array
          setImages((prev) => [
            ...prev,
            {
              url: data.url,
              description: "",
            },
          ]);

          toast.show({
            message: "Image uploaded successfully",
          });
        } else {
          throw new Error("Failed to upload image");
        }
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.show({
        message: error.message || "Failed to upload image",
        preset: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, compressImage, toast]);

  /**
   * Handle deleting an image
   */
  const handleDeleteImage = useCallback(() => {
    if (images.length > 0) {
      setImages((prev) => prev.filter((_, index) => index !== activeSlide));
      setActiveSlide((prev) => (prev > 0 ? prev - 1 : 0));
    }
    setDeleteModalVisible(false);
  }, [images, activeSlide]);

  /**
   * Handle updating image description
   */
  const handleImageDescriptionChange = useCallback((index, description) => {
    setImages((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          description,
        };
      }
      return updated;
    });
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    // Validate form
    if (images.length === 0) {
      toast.show({
        message: "Please upload at least one image",
        preset: "error",
      });
      return;
    }

    // Check if all images have descriptions
    const missingDescriptions = images.some((img) => !img.description);
    if (missingDescriptions) {
      toast.show({
        message: "Please add descriptions to all images",
        preset: "error",
      });
      return;
    }

    // Validate other fields based on event type
    if (eventType === I18n.t("Tactec.Match")) {
      if (!selectedLeague) {
        toast.show({
          message: "Please select a league",
          preset: "error",
        });
        return;
      }

      if (!homeTeam || !awayTeam) {
        toast.show({
          message: "Please select home and away teams",
          preset: "error",
        });
        return;
      }
    } else {
      if (!title.trim()) {
        toast.show({
          message: "Please enter a title",
          preset: "error",
        });
        return;
      }
    }

    // Submit the form
    setIsSubmitting(true);

    try {
      // Parse date from form values
      const date = parseFormDateTime(
        dateTimeValues.day,
        dateTimeValues.month,
        dateTimeValues.year,
        dateTimeValues.hours,
        dateTimeValues.minutes,
        dateTimeValues.ampm
      );

      // Prepare data based on event type
      let url = "";
      let data = {};

      if (eventType === I18n.t("Tactec.Match")) {
        url = "/v1/matches";
        data = {
          images: images.map((img) => ({
            url: img.url,
            description: img.description,
          })),
          date: date.toISOString(),
          leagues: selectedLeague,
          time: `${dateTimeValues.hours}:${dateTimeValues.minutes} ${dateTimeValues.ampm}`,
          teams: [homeTeam._id, awayTeam._id],
          isHome: homeTeam._id === teamId,
        };
      } else {
        url =
          eventType === I18n.t("Tactec.Task") ? "/v1/tasks" : "/v1/trainings";
        data = {
          title,
          images: images.map((img) => ({
            url: img.url,
            description: img.description,
          })),
          date: date.toISOString(),
          category: "tactical",
        };
      }

      // Send request
      const response = await axiosInterceptor({
        url,
        method: "POST",
        data,
        token,
      });

      if (response.status === 201 || response.status === 200) {
        toast.show({
          message: "Event created successfully",
        });

        // Navigate back or to a specific screen
        navigation.goBack();
      } else {
        throw new Error("Failed to create event");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.show({
        message: error.message || "Failed to create event",
        preset: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    eventType,
    title,
    selectedLeague,
    images,
    dateTimeValues,
    homeTeam,
    awayTeam,
    teamId,
    token,
    navigation,
    toast,
  ]);

  /**
   * Handle opening tactical pad
   */
  const handleOpenTacticalPad = useCallback(() => {
    navigation.navigate("TacticalPad", {
      eventImgs: images,
      setEventImgs: setImages,
    });
  }, [navigation, images]);

  /**
   * Handle assigning to players
   */
  const handleAssign = useCallback(() => {
    // Only for tasks and trainings
    if (eventType === I18n.t("Tactec.Task")) {
      navigation.navigate("TactecAssignTaskScreen");
    } else if (eventType === I18n.t("Tactec.Training")) {
      navigation.navigate("TactecAssignTrainingScreen");
    }
  }, [eventType, navigation]);

  /**
   * Handle cancellation
   */
  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Fetch leagues on mount
  useEffect(() => {
    const fetchLeagues = async () => {
      if (!token) return;

      setIsLoading(true);

      try {
        const response = await axiosInterceptor({
          url: "/v1/leagues/?pageNo=1&pageSize=30",
          method: "GET",
          token,
        });

        if (response.data?.records) {
          const leagues = response.data.records.map((item) => ({
            label: item.name,
            icon: item.icon,
            id: item._id,
            value: item._id,
          }));

          setLeagueData(leagues);

          // Set default league if available
          if (leagues.length > 0 && !selectedLeague) {
            setSelectedLeague(leagues[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching leagues:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeagues();
  }, [token]);

  return {
    eventType,
    setEventType,
    leagueData,
    selectedLeague,
    setSelectedLeague,
    title,
    setTitle,
    images,
    setImages,
    dateTimeValues,
    setDateTimeValues,
    activeSlide,
    setActiveSlide,
    uploadModalVisible,
    setUploadModalVisible,
    deleteModalVisible,
    setDeleteModalVisible,
    compressionVisible,
    compressionProgress,
    isLoading,
    isSubmitting,
    errorMessage,
    handleImageUpload,
    handleDeleteImage,
    handleImageDescriptionChange,
    handleCancel,
    handleSubmit,
    handleOpenTacticalPad,
    handleAssign,
  };
};
