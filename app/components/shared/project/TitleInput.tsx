import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { color } from "theme";
import I18n from "i18n-js";

interface TitleInputProps {
  /**
   * Current input value
   */
  value: string;

  /**
   * Callback when text changes
   */
  onChangeText: (text: string) => void;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Optional label text
   */
  label?: string;

  /**
   * Whether the input is disabled
   */
  disabled?: boolean;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Maximum length of input
   */
  maxLength?: number;
}

/**
 * Component for inputting event title
 */
export const TitleInput: React.FC<TitleInputProps> = ({
  value,
  onChangeText,
  placeholder = "",
  label = I18n.t("common.title"),
  disabled = false,
  error,
  maxLength = 100,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[
          styles.input,
          disabled && styles.disabledInput,
          error && styles.errorInput,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={color.line}
        editable={!disabled}
        maxLength={maxLength}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: color.text,
    marginBottom: 12,
  },
  input: {
    height: 50,
    backgroundColor: color.blackbg,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: color.line,
    fontSize: 14,
    color: color.text,
  },
  disabledInput: {
    opacity: 0.5,
  },
  errorInput: {
    borderColor: color.red || "red",
  },
  errorText: {
    fontSize: 12,
    color: color.red || "red",
    marginTop: 4,
  },
});
