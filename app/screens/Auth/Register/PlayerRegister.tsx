// screens/Auth/Register/PlayerRegister.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { color, padding, margin } from "theme";
import { axiosInterceptor } from "utils/axios-utils";
import { useLanguage } from "hooks/language/useLanguage";
import { AuthRouteParams } from "navigation/types/route-params";
import { useToast } from "components/toast/toast-context";
import I18n from "i18n-js";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Dropdown } from "react-native-element-dropdown";

type PlayerRegisterProps = NativeStackScreenProps<
  AuthRouteParams,
  "PlayerRegister"
>;

// Player registration screen component
const PlayerRegister = ({ navigation }: PlayerRegisterProps) => {
  const { isRTL } = useLanguage();
  const toast = useToast();

  // Basic info state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Player-specific info
  const [position, setPosition] = useState("");
  const [shirtNumber, setShirtNumber] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Position options
  const positionOptions = [
    { label: I18n.t("player.positions.goalkeeper"), value: "goalkeeper" },
    { label: I18n.t("player.positions.defender"), value: "defender" },
    { label: I18n.t("player.positions.midfielder"), value: "midfielder" },
    { label: I18n.t("player.positions.forward"), value: "forward" },
  ];

  // Validate form
  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      toast.show({
        message: I18n.t("auth.fieldsRequired"),
        preset: "error",
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast.show({
        message: I18n.t("auth.passwordsDontMatch"),
        preset: "error",
      });
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.show({
        message: I18n.t("auth.invalidEmail"),
        preset: "error",
      });
      return false;
    }

    // Password strength validation
    if (password.length < 8) {
      toast.show({
        message: I18n.t("auth.passwordTooShort"),
        preset: "error",
      });
      return false;
    }

    return true;
  };

  // Handle player registration
  const handleRegister = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Register the player
      const response = await axiosInterceptor({
        url: "/v1/auth/register/player",
        method: "POST",
        data: {
          name,
          email,
          password,
          phoneNumber,
          position,
          shirtNumber: shirtNumber ? parseInt(shirtNumber, 10) : undefined,
          height: height ? parseInt(height, 10) : undefined,
          weight: weight ? parseInt(weight, 10) : undefined,
          dateOfBirth,
        },
      });

      // Check for successful registration
      if (response?.data?.playerId) {
        // Navigate to complete registration screen
        navigation.navigate("CompletePlayerRegister", {
          playerId: response.data.playerId,
          email: email,
        });
      } else {
        throw new Error(I18n.t("auth.registrationFailed"));
      }
    } catch (error: any) {
      console.error("Player registration error:", error);
      const errorMessage =
        error.response?.data?.message || I18n.t("auth.registrationFailed");
      toast.show({
        message: errorMessage,
        preset: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    name,
    email,
    password,
    confirmPassword,
    phoneNumber,
    position,
    shirtNumber,
    height,
    weight,
    dateOfBirth,
    navigation,
    toast,
  ]);

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
            {I18n.t("auth.playerRegistration")}
          </Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>{I18n.t("auth.accountInfo")}</Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="person"
              size={20}
              color={color.primary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, isRTL && styles.inputRTL]}
              placeholder={I18n.t("auth.name")}
              placeholderTextColor={color.primaryLight}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="email"
              size={20}
              color={color.primary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, isRTL && styles.inputRTL]}
              placeholder={I18n.t("auth.email")}
              placeholderTextColor={color.primaryLight}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="lock"
              size={20}
              color={color.primary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, isRTL && styles.inputRTL]}
              placeholder={I18n.t("auth.password")}
              placeholderTextColor={color.primaryLight}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.visibilityButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={20}
                color={color.primaryLight}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="lock"
              size={20}
              color={color.primary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, isRTL && styles.inputRTL]}
              placeholder={I18n.t("auth.confirmPassword")}
              placeholderTextColor={color.primaryLight}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={styles.visibilityButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <MaterialIcons
                name={showConfirmPassword ? "visibility" : "visibility-off"}
                size={20}
                color={color.primaryLight}
              />
            </TouchableOpacity>
          </View>

          {/* Phone Number */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="phone"
              size={20}
              color={color.primary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, isRTL && styles.inputRTL]}
              placeholder={I18n.t("auth.phoneNumber")}
              placeholderTextColor={color.primaryLight}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <Text style={styles.sectionTitle}>{I18n.t("auth.playerInfo")}</Text>

          {/* Position Dropdown */}
          <View style={styles.dropdownContainer}>
            <MaterialIcons
              name="sports-soccer"
              size={20}
              color={color.primary}
              style={styles.inputIcon}
            />
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={positionOptions}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={I18n.t("player.selectPosition")}
              value={position}
              onChange={(item) => {
                setPosition(item.value);
              }}
            />
          </View>

          {/* Shirt Number */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="tag"
              size={20}
              color={color.primary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, isRTL && styles.inputRTL]}
              placeholder={I18n.t("player.shirtNumber")}
              placeholderTextColor={color.primaryLight}
              keyboardType="number-pad"
              value={shirtNumber}
              onChangeText={setShirtNumber}
            />
          </View>

          {/* Two-column layout for height and weight */}
          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, styles.halfInput]}>
              <MaterialIcons
                name="height"
                size={20}
                color={color.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, isRTL && styles.inputRTL]}
                placeholder={I18n.t("player.height") + " (cm)"}
                placeholderTextColor={color.primaryLight}
                keyboardType="number-pad"
                value={height}
                onChangeText={setHeight}
              />
            </View>

            <View style={[styles.inputContainer, styles.halfInput]}>
              <MaterialIcons
                name="fitness-center"
                size={20}
                color={color.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, isRTL && styles.inputRTL]}
                placeholder={I18n.t("player.weight") + " (kg)"}
                placeholderTextColor={color.primaryLight}
                keyboardType="number-pad"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
          </View>

          {/* Date of Birth */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="cake"
              size={20}
              color={color.primary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, isRTL && styles.inputRTL]}
              placeholder={I18n.t("player.dateOfBirth") + " (YYYY-MM-DD)"}
              placeholderTextColor={color.primaryLight}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={color.text} />
            ) : (
              <Text style={styles.registerButtonText}>
                {I18n.t("auth.continueRegistration")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginLinkText}>
              {I18n.t("auth.backToLogin")}
            </Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: margin.large,
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
  formContainer: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: color.primary,
    marginBottom: margin.medium,
    marginTop: margin.medium,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.blackbg,
    borderRadius: 8,
    marginBottom: margin.medium,
    borderWidth: 1,
    borderColor: color.border,
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.blackbg,
    borderRadius: 8,
    marginBottom: margin.medium,
    borderWidth: 1,
    borderColor: color.border,
  },
  dropdown: {
    flex: 1,
    height: 50,
    backgroundColor: "transparent",
  },
  placeholderStyle: {
    fontSize: 16,
    color: color.primaryLight,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: color.text,
  },
  inputIcon: {
    padding: padding.medium,
  },
  input: {
    flex: 1,
    paddingVertical: padding.medium,
    color: color.text,
    fontSize: 16,
  },
  inputRTL: {
    textAlign: "right",
  },
  visibilityButton: {
    padding: padding.medium,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    flex: 0.48, // Just under half to account for margins
  },
  registerButton: {
    backgroundColor: color.primary,
    borderRadius: 8,
    paddingVertical: padding.medium,
    alignItems: "center",
    marginTop: margin.large,
    marginBottom: margin.medium,
  },
  registerButtonText: {
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
});

export default PlayerRegister;
