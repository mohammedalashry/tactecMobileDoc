// screens/common/ProfileScreen.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import { DetailScreen } from "../../components/shared/layout/DetailScreen";
import { ImageUploader } from "../../components/shared/media/ImageUploader";
import { FormField } from "../../components/shared/forms/FormField";
import { Button } from "../../components/shared";
import { color, margin } from "theme";
import I18n from "i18n-js";

interface ProfileScreenProps {
  userData: any;
  isLoading: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onImageUpload: (image: any) => void;
  formValues: any;
  handleChange: (field: string, value: string) => void;
  errors: any;
  touched: any;
  showAdditionalFields?: boolean;
  additionalFields?: React.ReactNode;
}

export const ProfileScreen = ({
  userData,
  isLoading,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onImageUpload,
  formValues,
  handleChange,
  errors,
  touched,
  showAdditionalFields = false,
  additionalFields,
}: ProfileScreenProps) => {
  const headerRight = (
    <Button
      text={isEditing ? I18n.t("common.cancel") : I18n.t("common.edit")}
      onPress={isEditing ? onCancel : onEdit}
      preset="small"
    />
  );

  return (
    <DetailScreen
      title={I18n.t("menu.profile")}
      loading={isLoading}
      headerRight={headerRight}
    >
      <View style={styles.container}>
        <ImageUploader
          imageUrl={formValues.profileImage || userData?.profileImage}
          onImageSelected={onImageUpload}
          imageHeight={120}
          imageWidth={120}
          loading={false}
        />

        <View style={styles.formContainer}>
          <FormField
            label={I18n.t("profile.name")}
            value={formValues.name}
            onChangeText={(text) => handleChange("name", text)}
            placeholder={I18n.t("profile.namePlaceholder")}
            error={errors.name}
            touched={touched.name}
            editable={isEditing}
          />

          <FormField
            label={I18n.t("profile.email")}
            value={formValues.email}
            onChangeText={(text) => handleChange("email", text)}
            placeholder={I18n.t("profile.emailPlaceholder")}
            error={errors.email}
            touched={touched.email}
            editable={false} // Email is usually not editable
            keyboardType="email-address"
          />

          <FormField
            label={I18n.t("profile.phone")}
            value={formValues.phone}
            onChangeText={(text) => handleChange("phone", text)}
            placeholder={I18n.t("profile.phonePlaceholder")}
            error={errors.phone}
            touched={touched.phone}
            editable={isEditing}
            keyboardType="phone-pad"
          />

          {showAdditionalFields && additionalFields}

          {isEditing && (
            <Button
              text={I18n.t("common.save")}
              onPress={onSave}
              style={styles.saveButton}
            />
          )}
        </View>
      </View>
    </DetailScreen>
  );
};
// screens/common/ProfileScreen.tsx (updated styles)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: color.background,
  },
  formContainer: {
    width: "100%",
    marginTop: margin.large,
  },
  saveButton: {
    marginTop: margin.large,
    alignSelf: "center",
    backgroundColor: color.primary,
  },
});
