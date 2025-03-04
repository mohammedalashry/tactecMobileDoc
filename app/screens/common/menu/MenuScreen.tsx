// screens/common/menu/MenuScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
} from "react-native";
import { BaseScreen } from "components/shared/layout/BaseScreen";
import { Alert } from "components/shared/alerts/Alert";
import { SignOutAlert } from "components/shared/alerts/SignOutAlert";
import { LanguagesMenu } from "components/shared/language/LanguagesMenu";
import { color } from "theme";
import { useLanguage } from "hooks/language/useLanguage";
import { MenuItem } from "hooks/menu/useMenu";
import I18n from "i18n-js";

interface MenuScreenProps {
  navigation: any;
  menuList: MenuItem[];
  showAlert: boolean;
  showAlertSignOut: boolean;
  setShowAlert: (show: boolean) => void;
  setShowAlertSignOut: (show: boolean) => void;
  showLanguages: boolean;
  setShowLanguages: (show: boolean) => void;
  Confirm: () => void;
  Cancel: () => void;
  ConfirmSignOut: () => void;
  CancelSignOut: () => void;
  text: string;
  setText: (text: string) => void;
}

/**
 * Common Menu Screen component used across different roles
 */
const MenuScreen: React.FC<MenuScreenProps> = ({
  navigation,
  menuList,
  showAlert,
  showAlertSignOut,
  setShowAlert,
  setShowAlertSignOut,
  showLanguages,
  setShowLanguages,
  Confirm,
  Cancel,
  ConfirmSignOut,
  CancelSignOut,
  text,
  setText,
}) => {
  const { isRTL } = useLanguage();

  const renderMenuItem = ({ item }: { item: MenuItem }) => {
    return (
      <TouchableOpacity
        style={styles.menuItem}
        onPress={item.onHandlePress}
        disabled={item.disabled}
      >
        <View style={[styles.menuItemContent, isRTL && styles.menuItemRTL]}>
          <Image source={item.image} style={styles.menuIcon} />
          <Text style={styles.menuText}>{item.title}</Text>
          {item.arrow && <Image source={item.arrow} style={styles.arrowIcon} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <BaseScreen>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={menuList}
          renderItem={renderMenuItem}
          keyExtractor={(item, index) => `menu-item-${index}`}
          style={styles.menuList}
        />

        {/* Language Selection Menu */}
        <LanguagesMenu
          isVisible={showLanguages}
          onDismiss={() => setShowLanguages(false)}
          onLanguageSelect={(language) => {
            setText(language);
            setShowLanguages(false);
            setShowAlert(true);
          }}
        />

        {/* Confirm Language Change Alert */}
        <Alert
          isVisible={showAlert}
          title={I18n.t("menu.changeLanguage")}
          message={I18n.t("menu.changeLanguageConfirm")}
          primaryButtonText={I18n.t("common.yes")}
          secondaryButtonText={I18n.t("common.no")}
          onPrimaryAction={Confirm}
          onSecondaryAction={Cancel}
          onDismiss={Cancel}
          type="warning"
        />

        {/* Sign Out Confirmation Alert */}
        <SignOutAlert
          isVisible={showAlertSignOut}
          onConfirm={ConfirmSignOut}
          onCancel={CancelSignOut}
        />
      </SafeAreaView>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  menuList: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
    backgroundColor: color.blackbg,
    borderRadius: 10,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: color.border,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemRTL: {
    flexDirection: "row-reverse",
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
    resizeMode: "contain",
  },
  menuText: {
    color: color.text,
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  arrowIcon: {
    width: 12,
    height: 12,
    resizeMode: "contain",
  },
});

export default MenuScreen;
