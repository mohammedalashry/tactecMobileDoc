// screens/Auth/Login/Login.tsx
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
import { useDispatch } from "react-redux";
import { color, padding, margin } from "theme";
import { setUserData } from "redux/slices/login/loginSlice";
import { axiosInterceptor } from "utils/axios-utils";
import { useLanguage } from "hooks/language/useLanguage";
import { AuthStackParamList } from "../AuthScreens";
import { useToast } from "components/toast/toast-context";
import I18n from "i18n-js";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LoginProps = NativeStackScreenProps<AuthStackParamList, "Login">;

// Login screen component
const Login = ({ navigation }: LoginProps) => {
  const { isRTL } = useLanguage();
  const dispatch = useDispatch();
  const toast = useToast();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Handle login submission
  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      toast.show({
        message: I18n.t("auth.fieldsRequired"),
        preset: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInterceptor({
        url: "/v1/auth/login",
        method: "POST",
        data: {
          email,
          password,
        },
      });

      // Check if login was successful
      if (response?.data?.accessToken) {
        const { accessToken, userData } = response.data;

        // Save to Redux
        dispatch(setUserData({ accessToken, userData }));

        // Save to AsyncStorage if remember me is checked
        if (rememberMe) {
          await AsyncStorage.setItem("email", email);
          await AsyncStorage.setItem("rememberMe", "true");
        } else {
          await AsyncStorage.removeItem("email");
          await AsyncStorage.removeItem("rememberMe");
        }

        // Show success message
        toast.show({ message: I18n.t("auth.loginSuccess") });
      } else {
        throw new Error(I18n.t("auth.loginFailed"));
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || I18n.t("auth.loginFailed");
      toast.show({
        message: errorMessage,
        preset: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, password, rememberMe, dispatch, toast]);

  // Load saved email if remember me was checked
  React.useEffect(() => {
    const loadSavedEmail = async () => {
      try {
        const savedRememberMe = await AsyncStorage.getItem("rememberMe");
        if (savedRememberMe === "true") {
          const savedEmail = await AsyncStorage.getItem("email");
          if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
          }
        }
      } catch (error) {
        console.error("Error loading saved email:", error);
      }
    };

    loadSavedEmail();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("@assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>{I18n.t("auth.welcome")}</Text>
        <Text style={styles.subtitle}>{I18n.t("auth.loginToAccount")}</Text>

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

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.rememberContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <MaterialIcons
                name={rememberMe ? "check-box" : "check-box-outline-blank"}
                size={20}
                color={color.primary}
              />
              <Text style={styles.rememberText}>
                {I18n.t("auth.rememberMe")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("ForgetPassword")}
            >
              <Text style={styles.forgotText}>
                {I18n.t("auth.forgotPassword")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={color.text} />
            ) : (
              <Text style={styles.loginButtonText}>{I18n.t("auth.login")}</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>{I18n.t("auth.noAccount")}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>{I18n.t("auth.register")}</Text>
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
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: margin.large,
  },
  logo: {
    width: 120,
    height: 120,
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
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: margin.large,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    marginLeft: margin.small,
    color: color.text,
    fontSize: 14,
  },
  forgotText: {
    color: color.primary,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: color.primary,
    borderRadius: 8,
    paddingVertical: padding.medium,
    alignItems: "center",
    marginBottom: margin.large,
  },
  loginButtonText: {
    color: color.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    color: color.text,
    fontSize: 14,
  },
  registerLink: {
    color: color.primary,
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: margin.small,
  },
});

export default Login;
