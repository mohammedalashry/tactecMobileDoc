import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { useToast } from "components/toast/toast-context";
import {
  userProfileService,
  UserProfile,
} from "services/api/userProfileService";
import { ImageData } from "components/shared/media/ImageUploader";
import * as Yup from "yup";

export interface ProfileImage {
  type: "profile" | "id" | "passport" | "covid";
  url: string | null;
}

/**
 * Hook for managing user profile data and editing
 */
export const useProfile = (navigation: any) => {
  // Profile data state
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [loadUpdateMe, setLoadUpdateMe] = useState(false);

  // Image states
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [IDImg, setIDImg] = useState<string | null>(null);
  const [passportImg, setPassportImg] = useState<string | null>(null);
  const [covidImg, setCovidImg] = useState<string | null>(null);
  const [updateImg, setUpdateImg] = useState<ProfileImage | null>(null);

  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();

  // Form validation schema
  const UpdateMeSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string().min(6, "Phone number too short"),
  });

  // Fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);

    try {
      const data = await userProfileService.getCurrentUser(token);
      setUserData(data);

      // Set image URLs if available
      setProfileImg(data.profileImage || null);
      setIDImg(data.idImage || null);
      setPassportImg(data.passportImage || null);
      setCovidImg(data.covidImage || null);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.show({
        message: "Failed to load user profile",
        preset: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, toast]);

  // Toggle edit mode
  const toggleEdit = useCallback(() => {
    setOpenEdit((prev) => !prev);
  }, []);

  // Update profile data
  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!token) return;

      setLoadUpdateMe(true);

      try {
        await userProfileService.updateProfile(data, token);

        toast.show({
          message: "Profile updated successfully",
        });

        // Refresh profile data
        await fetchUserProfile();
        setOpenEdit(false);
      } catch (error: any) {
        console.error("Error updating profile:", error);
        toast.show({
          message: error.response?.data?.message || "Failed to update profile",
          preset: "error",
        });
      } finally {
        setLoadUpdateMe(false);
      }
    },
    [token, fetchUserProfile, toast]
  );

  // Handle image selection/upload
  const onPickImage = useCallback(
    async (
      imageData: ImageData,
      type: "profile" | "id" | "passport" | "covid"
    ) => {
      if (!token) return;

      try {
        const imageUrl = await userProfileService.uploadProfileImage(
          imageData,
          type,
          token
        );

        // Update the appropriate image state
        switch (type) {
          case "profile":
            setProfileImg(imageUrl);
            break;
          case "id":
            setIDImg(imageUrl);
            break;
          case "passport":
            setPassportImg(imageUrl);
            break;
          case "covid":
            setCovidImg(imageUrl);
            break;
        }

        setUpdateImg(null);

        // Refresh profile data
        await fetchUserProfile();

        toast.show({
          message: "Image uploaded successfully",
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.show({
          message: "Failed to upload image",
          preset: "error",
        });
      }
    },
    [token, fetchUserProfile, toast]
  );

  // Fetch data on mount
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return {
    userData,
    isLoading,
    openEdit,
    setOpenEdit,
    loadUpdateMe,
    profileImg,
    IDImg,
    passportImg,
    covidImg,
    updateImg,
    setUpdateImg,
    toggleEdit: toggleEdit,
    updateProfile,
    onPickImage,
    refetch: fetchUserProfile,
    UpdateMeSchema,
  };
};
