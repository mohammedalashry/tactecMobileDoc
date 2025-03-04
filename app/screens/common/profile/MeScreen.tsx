import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { color } from "theme";
import { useProfile } from "hooks/profile/useProfile";
import { ProfileHeader } from "components/shared/profile/ProfileHeader";
import { ProfileForm } from "components/shared/profile/ProfileForm";
import { ProfileImageModal } from "components/shared/profile/ProfileImageModal";
import { BaseScreen } from "components/shared/layout/BaseScreen";

interface MeScreenProps {
  navigation: any;
  showCovidField?: boolean;
  showEditButton?: boolean;
  role?: "player" | "tactical" | "medical" | "management";
}

/**
 * Shared profile screen that works across different user roles
 */
const MeScreen: React.FC<MeScreenProps> = ({
  navigation,
  showCovidField = true,
  showEditButton = true,
  role = "player",
}) => {
  const {
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
    toggleEdit,
    updateProfile,
    onPickImage,
  } = useProfile(navigation);

  // Handle the image modal
  const handleCloseImageModal = () => {
    setUpdateImg(null);
  };

  return (
    <BaseScreen backgroundColor={color.primarybg}>
      <View style={styles.container}>
        {/* Profile header */}
        <ProfileHeader
          navigation={navigation}
          userData={userData}
          profileImage={profileImg}
          openEdit={openEdit}
          toggleEdit={toggleEdit}
          showEditButton={showEditButton}
        />

        {/* Loading state */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={color.primary} />
          </View>
        ) : (
          <ProfileForm
            userData={userData}
            profileImg={profileImg}
            passportImg={passportImg}
            IDImg={IDImg}
            covidImg={covidImg}
            openEdit={openEdit}
            loadUpdateMe={loadUpdateMe}
            setUpdateImg={setUpdateImg}
            updateProfile={updateProfile}
            setOpenEdit={setOpenEdit}
            showCovidField={showCovidField}
          />
        )}

        {/* Image selection modal */}
        <ProfileImageModal
          isVisible={!!updateImg}
          onClose={handleCloseImageModal}
          imageType={updateImg?.type || null}
          currentImageUrl={updateImg?.url!}
          onImageSelected={onPickImage}
        />
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.primarybg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MeScreen;
