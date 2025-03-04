import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { color } from "theme";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import I18n from "i18n-js";
import { UserProfile } from "services/api/userProfileService";

interface ProfileHeaderProps {
  navigation: any;
  userData: UserProfile | null;
  profileImage: string | null;
  openEdit: boolean;
  toggleEdit: () => void;
  showEditButton?: boolean;
}

/**
 * Reusable profile header component with back button and optional edit button
 */
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  navigation,
  userData,
  profileImage,
  openEdit,
  toggleEdit,
  showEditButton = true,
}) => {
  return (
    <View style={styles.header}>
      <Image source={require("@assets/images/Screenshot1.png")} />

      <View style={styles.headerCard}>
        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.backButton}>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={20}
              color={color.text}
            />
            <Text style={styles.backText}>{I18n.t("Menu.Back")}</Text>
          </View>
        </TouchableOpacity>

        {/* User info */}
        <View style={styles.headerView}>
          <Image
            style={styles.headerImage}
            source={
              profileImage
                ? { uri: profileImage }
                : require("@assets/images/players/profiles/ProfileImg.png")
            }
            resizeMode={"contain"}
          />
          <Text style={styles.headerName}>{userData?.name || ""}</Text>
        </View>

        {/* Edit button (optional) */}
        {showEditButton ? (
          <TouchableOpacity onPress={toggleEdit}>
            <View
              style={[
                styles.IconView,
                { borderColor: openEdit ? color.primary : color.text },
              ]}
            >
              <MaterialIcons
                name="edit"
                size={25}
                color={openEdit ? color.primary : color.text}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40, height: 40 }} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.blackbg,
  },
  headerCard: {
    flexDirection: "row",
    height: 100,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  backButton: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  backText: {
    fontSize: 14,
    color: color.text,
  },
  headerView: {
    flexDirection: "row",
    backgroundColor: color.blackbg,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  headerImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 20,
  },
  headerName: {
    color: color.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  IconView: {
    width: 40,
    height: 40,
    borderRadius: 5,
    borderColor: color.line,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
