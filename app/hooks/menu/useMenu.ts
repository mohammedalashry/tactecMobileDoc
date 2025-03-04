import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "redux/store";
import { useToast } from "components/toast/toast-context";
import { axiosInterceptor } from "utils/axios-utils";
import { userProfileService } from "services/api/userProfileService";
import { languageService } from "services/language/languageService";
import { userLogout as signOut } from "redux/slices/login/loginSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import I18n from "i18n-js";

// Asset paths need to be compatible with both platforms
const getAssetPath = (path) => {
  return Platform.select({
    ios: path,
    android: path,
    default: path,
  });
};

export interface MenuItem {
  title: string;
  image: any;
  onHandlePress: () => void;
  arrow?: any;
  disabled?: boolean;
  hideForRoles?: string[];
}

/**
 * Base hook for menu functionality with shared logic between user roles
 */
export const useMenu = (navigation: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [meData, setMeData] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertSignOut, setShowAlertSignOut] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [text, setText] = useState("");

  const token = useSelector((state: RootState) => state.login.accessToken);
  const toast = useToast();
  const dispatch = useDispatch();

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);

    try {
      // Use the userProfileService to get current user
      const data = await userProfileService.getCurrentUser(token);
      setUserData(data);

      // Fetch additional details about the user if needed
      const meResponse = await axiosInterceptor({
        url: "/v1/me",
        method: "GET",
        token,
      });

      setMeData(meResponse?.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.show({
        message: "Failed to load user profile",
        preset: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, toast]);

  // Handle language change confirmation
  const Confirm = useCallback(async () => {
    try {
      await languageService.setLanguage(text);
      setShowAlert(false);
      // Refresh application to apply language changes
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "IntroApp" }],
        });
      }, 500);
    } catch (error) {
      console.error("Error changing language:", error);
      toast.show({
        message: "Failed to change language",
        preset: "error",
      });
    }
  }, [text, navigation, toast]);

  // Handle language change cancellation
  const Cancel = useCallback(() => {
    setShowAlert(false);
  }, []);

  // Handle sign out confirmation
  const ConfirmSignOut = useCallback(async () => {
    try {
      await AsyncStorage.clear();
      dispatch(signOut());
      // Navigate back to intro/login
      navigation.reset({
        index: 0,
        routes: [{ name: "IntroApp" }],
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast.show({
        message: "Failed to sign out",
        preset: "error",
      });
    }
  }, [dispatch, navigation, toast]);

  // Handle sign out cancellation
  const CancelSignOut = useCallback(() => {
    setShowAlertSignOut(false);
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    isLoading,
    userData,
    meData,
    toast,
    showAlert,
    setShowAlert,
    text,
    setText,
    Confirm,
    Cancel,
    showAlertSignOut,
    setShowAlertSignOut,
    showLanguages,
    setShowLanguages,
    ConfirmSignOut,
    CancelSignOut,
  };
};

/**
 * Hook for player menu with player-specific menu items
 */
export const usePlayerMenu = (navigation: any) => {
  const baseMenu = useMenu(navigation);

  // Define player-specific menu items
  const menuList: MenuItem[] = [
    {
      title: I18n.t("menu.profile"),
      image: getAssetPath(require("@assets/images/Menu/bx_user.png")),
      onHandlePress: () =>
        navigation.navigate("TopTabProfile", {
          screen: "PersonalDataScreen",
        }),
    },
    {
      title: I18n.t("menu.checkIn"),
      image: getAssetPath(require("@assets/images/Menu/Vector4.png")),
      onHandlePress: () => navigation.navigate("CheckInScreen"),
    },
    {
      title: I18n.t("menu.wellness"),
      image: getAssetPath(require("@assets/images/Menu/Vector5.png")),
      onHandlePress: () =>
        navigation.navigate("TopTabProfile", {
          screen: "WellnessCheckScreen",
        }),
    },
    {
      title: I18n.t("menu.medical"),
      image: getAssetPath(require("@assets/images/Menu/Vector6.png")),
      onHandlePress: () =>
        navigation.navigate("TopTabProfile", {
          screen: "MedicalComplaintsScreen",
        }),
    },
    {
      title: I18n.t("menu.language"),
      image: getAssetPath(require("@assets/images/Menu/Vector2.png")),
      onHandlePress: () => baseMenu.setShowLanguages(true),
      arrow: getAssetPath(require("@assets/images/Menu/Polygon1.png")),
    },
    {
      title: I18n.t("menu.signOut"),
      image: getAssetPath(require("@assets/images/Menu/Vector3.png")),
      onHandlePress: () => baseMenu.setShowAlertSignOut(true),
    },
  ];

  return {
    ...baseMenu,
    menuList,
  };
};

/**
 * Hook for staff menu with staff-specific menu items (management, tactical, medical)
 */
export const useStaffMenu = (
  navigation: any,
  role: "tactical" | "medical" | "management"
) => {
  const baseMenu = useMenu(navigation);

  // Define staff menu items (used by tactical, medical, management)
  const menuList: MenuItem[] = [
    {
      title: I18n.t("menu.profile"),
      image: getAssetPath(require("@assets/images/Menu/bx_user.png")),
      onHandlePress: () => navigation.navigate("MeScreen"),
    },
    {
      title: I18n.t("menu.playerProfiles"),
      image: getAssetPath(require("@assets/images/Menu/Vector.png")),
      onHandlePress: () =>
        navigation.navigate("Players", {
          screen: "ProfilesScreen",
        }),
    },
    {
      title: I18n.t("menu.playerAttendance"),
      image: getAssetPath(require("@assets/images/Menu/user.png")),
      onHandlePress: () =>
        navigation.navigate("Players", {
          screen: "AttendanceScreen",
        }),
    },
    {
      title: I18n.t("menu.formation"),
      image: getAssetPath(require("@assets/images/Menu/Vector1.png")),
      onHandlePress: baseMenu.meData?.dataEntry
        ? () => navigation.navigate("TacTecBoardScreen")
        : () =>
            baseMenu.toast.show({
              message: I18n.t("menu.noPermission"),
              preset: "error",
            }),
      hideForRoles: role === "tactical" ? [] : ["medical", "management"],
    },
    {
      title: I18n.t("menu.language"),
      image: getAssetPath(require("@assets/images/Menu/Vector2.png")),
      onHandlePress: () => baseMenu.setShowLanguages(true),
      arrow: getAssetPath(require("@assets/images/Menu/Polygon1.png")),
    },
    {
      title: I18n.t("menu.signOut"),
      image: getAssetPath(require("@assets/images/Menu/Vector3.png")),
      onHandlePress: () => baseMenu.setShowAlertSignOut(true),
    },
  ];

  // Filter out items based on role
  const filteredMenuList = menuList.filter(
    (item) => !item.hideForRoles || !item.hideForRoles.includes(role)
  );

  return {
    ...baseMenu,
    menuList: filteredMenuList,
  };
};
