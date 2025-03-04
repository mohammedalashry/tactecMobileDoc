import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { color } from "theme";
import { Button } from "components";
import I18n from "i18n-js";
import { UserProfile } from "services/api/userProfileService";
import { FormField } from "components/shared/forms/FormField";
import { Avatar } from "components/shared/media/Avatar";
import AntDesign from "react-native-vector-icons/AntDesign";

interface ProfileFormProps {
  userData: UserProfile | null;
  profileImg: string | null;
  passportImg: string | null;
  IDImg: string | null;
  covidImg?: string | null;
  openEdit: boolean;
  loadUpdateMe: boolean;
  setUpdateImg: (value: {
    type: "profile" | "id" | "passport" | "covid";
    url: string | null;
  }) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  setOpenEdit: (value: boolean) => void;
  showCovidField?: boolean;
}

/**
 * Reusable profile form component for viewing and editing user profile
 */
export const ProfileForm: React.FC<ProfileFormProps> = ({
  userData,
  profileImg,
  passportImg,
  IDImg,
  covidImg,
  openEdit,
  loadUpdateMe,
  setUpdateImg,
  updateProfile,
  setOpenEdit,
  showCovidField = true,
}) => {
  // Form state
  const [name, setName] = useState(userData?.name || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [phone, setPhone] = useState(userData?.phoneNumber || "");

  // Form validation errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    let hasErrors = false;
    const newErrors = {
      name: "",
      email: "",
      phone: "",
    };

    if (!name.trim()) {
      newErrors.name = "Name is required";
      hasErrors = true;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!email.includes("@")) {
      newErrors.email = "Invalid email format";
      hasErrors = true;
    }

    if (phone && phone.length < 6) {
      newErrors.phone = "Phone number too short";
      hasErrors = true;
    }

    setErrors(newErrors);

    if (hasErrors) return;

    // Submit form
    updateProfile({
      name,
      email,
      phoneNumber: phone,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentView}>
        {openEdit ? (
          // Edit mode - show form fields
          <>
            <View style={styles.formField}>
              <Text style={styles.label}>{I18n.t("Menu.Name")}</Text>
              <FormField
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
                error={errors.name}
                touched={true}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>{I18n.t("Menu.Email")}</Text>
              <FormField
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                keyboardType="email-address"
                error={errors.email}
                touched={true}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.label}>{I18n.t("Menu.Phone")}</Text>
              <FormField
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                error={errors.phone}
                touched={true}
              />
            </View>
          </>
        ) : (
          // View mode - show display fields
          <>
            <View style={styles.contentCard}>
              <Text style={styles.fieldTitle}>{I18n.t("Menu.Name")} </Text>
              <Text style={styles.fieldValue}>{userData?.name}</Text>
            </View>

            <View style={styles.contentCard}>
              <Text style={styles.fieldTitle}>{I18n.t("Menu.Phone")} </Text>
              <Text style={styles.fieldValue}> {userData?.phoneNumber}</Text>
            </View>

            <View style={styles.contentCard}>
              <Text style={styles.fieldTitle}>{I18n.t("Menu.Email")} </Text>
              <Text style={styles.fieldValue}> {userData?.email}</Text>
            </View>
          </>
        )}

        {/* ID and Passport Images */}
        <View style={styles.imageSection}>
          <View style={styles.imageItem}>
            <Text style={styles.imageTitle}>
              {I18n.t("signUpScreen.IdPhote")}
            </Text>
            <TouchableOpacity
              onPress={() => setUpdateImg({ type: "id", url: IDImg })}
              disabled={!openEdit}
            >
              {IDImg ? (
                <Image
                  source={{ uri: IDImg }}
                  style={styles.documentImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.addPhotoCard}>
                  <AntDesign
                    style={{ alignSelf: "center" }}
                    name="pluscircleo"
                    size={25}
                    color={color.line}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.imageItem}>
            <Text style={styles.imageTitle}>
              {I18n.t("signUpScreen.PassportPhoto")}
            </Text>
            <TouchableOpacity
              onPress={() =>
                setUpdateImg({ type: "passport", url: passportImg })
              }
              disabled={!openEdit}
            >
              {passportImg ? (
                <Image
                  source={{ uri: passportImg }}
                  style={styles.documentImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.addPhotoCard}>
                  <AntDesign
                    style={{ alignSelf: "center" }}
                    name="pluscircleo"
                    size={25}
                    color={color.line}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* COVID Vaccine Certificate (optional) */}
        {showCovidField && (
          <View style={styles.covidSection}>
            <Text style={styles.imageTitle}>COVID Vaccine Certificate:</Text>

            <TouchableOpacity
              onPress={() =>
                setUpdateImg({ type: "covid", url: covidImg || null })
              }
              disabled={!openEdit}
            >
              {covidImg ? (
                <Image
                  source={{ uri: covidImg }}
                  style={styles.documentImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.addPhotoCard}>
                  <AntDesign
                    style={{ alignSelf: "center" }}
                    name="pluscircleo"
                    size={25}
                    color={color.line}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Action buttons */}
      {openEdit && (
        <View style={styles.buttonContainer}>
          <Button
            style={styles.cancelButton}
            text={I18n.t("Home.Cancel")}
            onPress={() => setOpenEdit(false)}
          />
          <Button
            style={styles.submitButton}
            text={I18n.t("Menu.Confirm")}
            loading={loadUpdateMe}
            onPress={handleSubmit}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentView: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: color.primary,
    marginBottom: 4,
  },
  contentCard: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  fieldTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: color.primary,
    marginRight: 8,
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: "700",
    color: color.text,
  },
  imageSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
  },
  imageItem: {
    alignItems: "center",
  },
  imageTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: color.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  documentImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  addPhotoCard: {
    backgroundColor: "#373737",
    width: 87,
    height: 100,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  covidSection: {
    alignItems: "center",
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 30,
  },
  cancelButton: {
    width: 100,
    height: 42,
    borderRadius: 25,
    backgroundColor: color.background,
    borderColor: color.line,
    borderWidth: 1,
  },
  submitButton: {
    width: 100,
    height: 42,
    borderRadius: 25,
  },
});

// Need a TypeScript interface for the Image component
interface ImageProps {
  source: { uri: string } | number;
  style: any;
  resizeMode: "contain" | "cover" | "stretch" | "center";
}

// Simple Image component implementation
const Image: React.FC<ImageProps> = ({ source, style, resizeMode }) => {
  return (
    <View style={[styles.imageWrapper, style]}>
      <Avatar
        uri={typeof source === "number" ? undefined : source.uri}
        size={style.width}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // ... existing styles
  imageWrapper: {
    overflow: "hidden",
  },
});
