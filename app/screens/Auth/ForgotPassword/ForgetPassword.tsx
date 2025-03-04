// screens/Auth/ForgotPassword/ForgetPassword.tsx
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

type ForgetPasswordProps = NativeStackScreenProps<
  AuthRouteParams,
  "ForgetPassword"
>;

// ForgetPassword screen component
const ForgetPassword = ({ navigation }: ForgetPasswordProps) => {
  const { isRTL } = useLanguage();
  const toast = useToast();

  // Form state
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Handle reset password submission
  const handleResetPassword = useCallback(async () => {
    if (!email) {
      toast.show({
        message: I18n.t("auth.emailRequired"),
        preset: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInterceptor({
        url: "/v1/auth/forgot-password",
        method: "POST",
        data: {
          email,
        },
      });

      // Handle successful reset request
      setResetSent(true);
      toast.show({
        message: I18n.t("auth.resetLinkSent"),
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      const errorMessage =
        error.response?.data?.message || I18n.t("auth.resetFailed");
      toast.show({
        message: errorMessage,
        preset: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, toast]);

  // Reset form and try again
  const handleTryAgain = () => {
    setEmail("");
    setResetSent(false);
  };

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

        <Text style={styles.title}>{I18n.t("auth.forgotPassword")}</Text>
        <Text style={styles.subtitle}>{I18n.t("auth.forgotPasswordDesc")}</Text>

        {!resetSent ? (
          // Reset password form
          <View style={styles.formContainer}>
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

            {/* Reset Button */}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={color.text} />
              ) : (
                <Text style={styles.resetButtonText}>
                  {I18n.t("auth.resetPassword")}
                </Text>
              )}
            </TouchableOpacity>

            {/* Back to Login Link */}
            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.backToLoginText}>
                {I18n.t("auth.backToLogin")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Success message
          <View style={styles.successContainer}>
            <View style={styles.successIconContainer}>
              <MaterialIcons
                name="check-circle"
                size={60}
                color={color.success}
              />
            </View>
            <Text style={styles.successTitle}>{I18n.t("auth.checkEmail")}</Text>
            <Text style={styles.successMessage}>
              {I18n.t("auth.resetInstructions")}
            </Text>

            <TouchableOpacity
              style={styles.tryAgainButton}
              onPress={handleTryAgain}
            >
              <Text style={styles.tryAgainText}>
                {I18n.t("auth.tryAnotherEmail")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.backToLoginText}>
                {I18n.t("auth.backToLogin")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginVertical: margin.large,
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
  resetButton: {
    backgroundColor: color.primary,
    borderRadius: 8,
    paddingVertical: padding.medium,
    alignItems: "center",
    marginBottom: margin.large,
  },
  resetButtonText: {
    color: color.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  backToLoginButton: {
    alignItems: "center",
    marginTop: margin.medium,
  },
  backToLoginText: {
    color: color.primary,
    fontSize: 16,
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: padding.large,
  },
  successIconContainer: {
    marginBottom: margin.large,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: color.text,
    marginBottom: margin.medium,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    color: color.primaryLight,
    marginBottom: margin.large,
    textAlign: "center",
    lineHeight: 24,
  },
  tryAgainButton: {
    backgroundColor: color.blackbg,
    borderRadius: 8,
    paddingVertical: padding.medium,
    paddingHorizontal: padding.large,
    alignItems: "center",
    marginBottom: margin.medium,
    borderWidth: 1,
    borderColor: color.primary,
  },
  tryAgainText: {
    color: color.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ForgetPassword;
