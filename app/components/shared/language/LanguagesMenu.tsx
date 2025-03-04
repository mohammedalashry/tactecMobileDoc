// components/shared/language/LanguagesMenu.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { color, padding, margin } from "theme";
import { useLanguage } from "hooks/language/useLanguage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import I18n from "i18n-js";

interface LanguagesMenuProps {
  isVisible: boolean;
  onDismiss: () => void;
  onLanguageSelect: (language: string) => void;
}

/**
 * Component for selecting application language
 */
export const LanguagesMenu: React.FC<LanguagesMenuProps> = ({
  isVisible,
  onDismiss,
  onLanguageSelect,
}) => {
  const { currentLanguage, LANGUAGES } = useLanguage();

  // Available languages with display names
  const languages = [
    { id: LANGUAGES.ENGLISH, name: "English" },
    { id: LANGUAGES.ARABIC, name: "العربية" },
    { id: LANGUAGES.SPANISH, name: "Español" },
    { id: LANGUAGES.PORTUGUESE, name: "Português" },
  ];

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {I18n.t("language.selectLanguage")}
            </Text>
            <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={color.text} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.id}
                style={[
                  styles.languageOption,
                  currentLanguage === language.id && styles.selectedLanguage,
                ]}
                onPress={() => {
                  onLanguageSelect(language.id);
                  onDismiss();
                }}
              >
                <Text
                  style={[
                    styles.languageName,
                    currentLanguage === language.id &&
                      styles.selectedLanguageText,
                  ]}
                >
                  {language.name}
                </Text>
                {currentLanguage === language.id && (
                  <MaterialIcons
                    name="check-circle"
                    size={24}
                    color={color.primary}
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: padding.medium,
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: color.blackbg,
    borderRadius: 12,
    padding: padding.medium,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: margin.medium,
    paddingBottom: padding.small,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: color.text,
  },
  closeButton: {
    padding: 4,
  },
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: padding.medium,
    paddingHorizontal: padding.small,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  selectedLanguage: {
    backgroundColor: color.primary + "20", // 20% opacity
  },
  languageName: {
    fontSize: 16,
    color: color.text,
  },
  selectedLanguageText: {
    fontWeight: "bold",
    color: color.primary,
  },
  checkIcon: {
    marginLeft: margin.small,
  },
});
