import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { color } from "theme";
import I18n from "i18n-js";

interface EventTypeSelectorProps {
  /**
   * Currently selected event type
   */
  selectedType: string;

  /**
   * Callback when event type changes
   */
  onTypeChange: (type: string) => void;
}

/**
 * Component for selecting event type (Match, Training, Task)
 */
export const EventTypeSelector: React.FC<EventTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
}) => {
  const eventTypes = [
    I18n.t("Tactec.Match"),
    I18n.t("Tactec.Training"),
    I18n.t("Tactec.Task"),
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{I18n.t("common.eventType")}</Text>

      <View style={styles.buttonGroup}>
        {eventTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.button,
              selectedType === type && styles.selectedButton,
            ]}
            onPress={() => onTypeChange(type)}
          >
            <Text
              style={[
                styles.buttonText,
                selectedType === type && styles.selectedButtonText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    backgroundColor: color.blackbg,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.line,
  },
  selectedButton: {
    backgroundColor: color.primary,
    borderColor: color.primary,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: color.text,
  },
  selectedButtonText: {
    color: color.blackbg,
    fontWeight: "bold",
  },
});
