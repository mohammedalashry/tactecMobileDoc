// screens/Auth/Register/Register.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
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

type RegisterProps = NativeStackScreenProps<AuthRouteParams, "Register">;

// Register screen component
const Register = ({ navigation }: RegisterProps) => {
  const { isRTL } = useLanguage();
  const toast = useToast();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("coach"); // Default role: coach
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Available roles
  const roles = [
    { id: "coach", label: I18n.t("auth.coach") },
    { id: "player", label: I18n.t("auth.player") },
    { id: "medical", label: I18n.t("auth.medical") },
    { id: "management", label: I18n.t("auth.management") },
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

  // Handle register submission
  const handleRegister = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // If role is player, navigate to player-specific registration
      if (role === "player") {
        navigation.navigate("PlayerRegister");
        setIsLoading(false);
        return;
      }

      // For staff roles (coach, medical, management), register directly
      const response = await axiosInterceptor({
        url: "/v1/auth/register",
        method: "POST",
        data: {
          name,
          email,
          password,
          role,
        },
      });

      toast.show({
        message: I18n.t("auth.registrationSuccess"),
      });

      // Navigate back to login
      navigation.navigate("Login");
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message || I18n.t("auth.registrationFailed");
      toast.show({
        message: errorMessage,
        preset: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [name, email, password, confirmPassword, role, navigation, toast]);

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
        </View>

        <View style={styles.logoContainer}>
          <Image
            source={require("@assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>{I18n.t("auth.createAccount")}</Text>
        <Text style={styles.subtitle}>{I18n.t("auth.fillDetails")}</Text>

        <View style={styles.formContainer}>
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

          {/* Role Selection */}
          <Text style={styles.roleLabel}>{I18n.t("auth.selectRole")}</Text>
          <View style={styles.rolesContainer}>
            {roles.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.roleOption,
                  role === item.id && styles.roleOptionSelected,
                ]}
                onPress={() => setRole(item.id)}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === item.id && styles.roleTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
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
                {I18n.t("auth.register")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              {I18n.t("auth.alreadyHaveAccount")}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>{I18n.t("auth.login")}</Text>
            </TouchableOpacity>
          </View>
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
    width: "100%",
    alignItems: "flex-start",
    marginBottom: margin.medium,
  },
  backButton: {
    padding: padding.small,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: margin.medium,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: color.text,
    marginBottom: margin.small,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: color.primaryLight,
    marginBottom: margin.large,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
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
  roleLabel: {
    fontSize: 16,
    color: color.text,
    marginBottom: margin.small,
  },
  rolesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: margin.large,
  },
  roleOption: {
    paddingVertical: padding.small,
    paddingHorizontal: padding.medium,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: color.border,
    marginRight: margin.small,
    marginBottom: margin.small,
  },
  roleOptionSelected: {
    backgroundColor: color.primary,
    borderColor: color.primary,
  },
  roleText: {
    color: color.text,
    fontSize: 14,
  },
  roleTextSelected: {
    color: color.text,
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: color.primary,
    borderRadius: 8,
    paddingVertical: padding.medium,
    alignItems: "center",
    marginBottom: margin.large,
  },
  registerButtonText: {
    color: color.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: color.text,
    fontSize: 14,
  },
  loginLink: {
    color: color.primary,
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: margin.small,
  },
});

export default Register;
