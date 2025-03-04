import {useState, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useToast} from 'components/toast/toast-context';
import {
  userProfileService,
  UserProfile,
} from '../../services/api/userProfileService';
import {ImageData} from '../../components/shared/media/ImageUploader';
import * as Yup from 'yup';

interface UseUserProfileOptions {
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
 * Custom hook to fetch and manage user profile data
 *
 * @param options Hook options
 */
export const useUserProfile = (
  options: UseUserProfileOptions = {useCache: true, autoFetch: true},
) => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(options.autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateImageModalVisible, setUpdateImageModalVisible] = useState(false);
  const [selectedImageType, setSelectedImageType] = useState<
    'profile' | 'id' | 'passport' | 'covid' | null
  >(null);

  // Date picker state
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');

  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();

  // Validation schema
  const profileSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Name too short').required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: Yup.string().min(7, 'Phone number too short'),
  });

  const fetchUserProfile = useCallback(
    async (forceRefresh: boolean = false) => {
      if (!token) {
        setError('No authentication token available');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // If forceRefresh is true, bypass cache
        const useCache = options.useCache && !forceRefresh;
        const data = await userProfileService.getCurrentUser(token, useCache);
        setUserData(data);

        // Set date of birth if available
        if (data.dateOfBirth) {
          const date = new Date(data.dateOfBirth);
          setBirthDay(date.getDate().toString());
          setBirthMonth((date.getMonth() + 1).toString());
          setBirthYear(date.getFullYear().toString());
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
        toast.show({
          message: 'Failed to load user profile',
          preset: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [token, options.useCache, toast],
  );

  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!token) {
        setError('No authentication token available');
        return false;
      }

      setIsUpdating(true);
      setError(null);

      try {
        // Format date of birth if all fields are filled
        if (birthDay && birthMonth && birthYear) {
          data.dateOfBirth = new Date(
            parseInt(birthYear),
            parseInt(birthMonth) - 1,
            parseInt(birthDay),
          ).toISOString();
        }

        // Validate data
        await profileSchema.validate(data);

        // Send update request
        await userProfileService.updateProfile(data, token);

        // Refresh user data
        await fetchUserProfile(true);

        toast.show({
          message: 'Profile updated successfully',
        });

        return true;
      } catch (err: any) {
        console.error('Error updating user profile:', err);

        // Show Yup validation errors or API errors
        const errorMessage = err.message || 'Failed to update profile';

        setError(errorMessage);
        toast.show({
          message: errorMessage,
          preset: 'error',
        });

        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [
      token,
      birthDay,
      birthMonth,
      birthYear,
      fetchUserProfile,
      profileSchema,
      toast,
    ],
  );

  const uploadImage = useCallback(
    async (
      imageData: ImageData,
      imageType: 'profile' | 'id' | 'passport' | 'covid',
    ) => {
      if (!token) {
        setError('No authentication token available');
        return null;
      }

      setIsUpdating(true);
      setError(null);

      try {
        const imageUrl = await userProfileService.uploadProfileImage(
          imageData,
          imageType,
          token,
        );

        // Refresh user data
        await fetchUserProfile(true);

        toast.show({
          message: `${
            imageType.charAt(0).toUpperCase() + imageType.slice(1)
          } image uploaded successfully`,
        });

        return imageUrl;
      } catch (err) {
        console.error(`Error uploading ${imageType} image:`, err);
        toast.show({
          message: `Failed to upload ${imageType} image`,
          preset: 'error',
        });
        return null;
      } finally {
        setIsUpdating(false);
        setUpdateImageModalVisible(false);
        setSelectedImageType(null);
      }
    },
    [token, fetchUserProfile, toast],
  );

  const openImageUpload = useCallback(
    (imageType: 'profile' | 'id' | 'passport' | 'covid') => {
      setSelectedImageType(imageType);
      setUpdateImageModalVisible(true);
    },
    [],
  );

  const toggleEditMode = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  // Fetch data on mount if autoFetch is true
  useEffect(() => {
    if (options.autoFetch) {
      fetchUserProfile();
    }
  }, [options.autoFetch, fetchUserProfile]);

  return {
    userData,
    isLoading,
    isUpdating,
    error,
    isEditing,
    toggleEditMode,
    updateProfile,
    fetchUserProfile,
    uploadImage,
    updateImageModalVisible,
    setUpdateImageModalVisible,
    selectedImageType,
    openImageUpload,
    birthDay,
    setBirthDay,
    birthMonth,
    setBirthMonth,
    birthYear,
    setBirthYear,
    profileSchema,
  };
};
