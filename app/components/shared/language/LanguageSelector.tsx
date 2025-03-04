// components/shared/language/LanguageSelector.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import {
  languageService,
  LANGUAGES,
} from "../../../services/language/languageService";
import { color, margin, padding, typography } from "theme";
import I18n from "i18n-js";
import { Alert } from "../alerts/Alert";

interface LanguageOption {
  label: string;
  value: string;
}

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void;
}

export const LanguageSelector = ({
  onLanguageChange,
}: LanguageSelectorProps) => {
  const currentLang = useSelector((state: RootState) => state.lang.currentLang);
  const [alertVisible, setAlertVisible] = useState(false);

  const languageOptions: LanguageOption[] = [
    { label: "English", value: LANGUAGES.ENGLISH },
    { label: "العربية", value: LANGUAGES.ARABIC },
    { label: "Español", value: LANGUAGES.SPANISH },
    { label: "Português", value: LANGUAGES.PORTUGUESE },
  ];

  const getLanguageLabel = (value: string) => {
    const option = languageOptions.find((option) => option.value === value);
    return option?.label || "English";
  };

  const handleLanguageSelect = async (language: string) => {
    if (language === currentLang) {
      setAlertVisible(false);
      return;
    }

    try {
      await languageService.setLanguage(language);

      // Call callback if provided
      if (onLanguageChange) {
        onLanguageChange(language);
      }

      setAlertVisible(false);

      // Show restart message if switching to/from RTL language
      if (language === LANGUAGES.ARABIC || currentLang === LANGUAGES.ARABIC) {
        // Implementation depends on your app's architecture
        // You might want to show a message asking the user to restart the app
        // for RTL changes to take full effect
      }
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setAlertVisible(true)}
      >
        <Text style={styles.label}>{I18n.t("settings.language")}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{getLanguageLabel(currentLang!)}</Text>
        </View>
      </TouchableOpacity>

      <Alert
        isVisible={alertVisible}
        title={I18n.t("settings.selectLanguage")}
        onDismiss={() => setAlertVisible(false)}
        primaryButtonText={I18n.t("common.cancel")}
        onPrimaryAction={() => setAlertVisible(false)}
        type="default"
      >
        <View style={styles.languageOptions}>
          {languageOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.languageOption,
                currentLang === option.value && styles.selectedLanguage,
              ]}
              onPress={() => handleLanguageSelect(option.value)}
            >
              <Text
                style={[
                  styles.languageText,
                  currentLang === option.value && styles.selectedLanguageText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Alert>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: padding.medium,
    paddingHorizontal: padding.base,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  label: {
    fontSize: 16,
    fontFamily: typography.primary,
    color: color.text,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    fontFamily: typography.primary,
    color: color.primary,
    marginRight: margin.small,
  },
  languageOptions: {
    width: "100%",
    marginVertical: margin.medium,
  },
  languageOption: {
    paddingVertical: padding.medium,
    paddingHorizontal: padding.base,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  selectedLanguage: {
    backgroundColor: color.primaryLight,
  },
  languageText: {
    fontSize: 16,
    fontFamily: typography.primary,
    color: color.text,
    textAlign: "center",
  },
  selectedLanguageText: {
    color: color.primary,
    fontFamily: typography.bold,
  },
});
