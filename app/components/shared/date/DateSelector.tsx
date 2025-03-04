import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { color } from "theme";
import moment from "moment";

interface DateSelectorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  allowFutureDates?: boolean;
}

/**
 * Reusable date selector component with previous/next day controls
 */
export const DateSelector: React.FC<DateSelectorProps> = ({
  currentDate,
  onDateChange,
  allowFutureDates = false,
}) => {
  // Go to previous day
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  // Go to next day if allowed
  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);

    // Check if future date is allowed
    if (!allowFutureDates && newDate > new Date()) {
      return;
    }

    onDateChange(newDate);
  };

  // Determine if next button should be disabled
  const isNextDisabled =
    !allowFutureDates &&
    moment(currentDate).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD");

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToPreviousDay}>
        <MaterialIcons
          name="keyboard-arrow-left"
          color={color.text}
          size={30}
        />
      </TouchableOpacity>

      <View style={styles.dateView}>
        <Text style={styles.dateText}>
          {moment(currentDate).format("ddd, ")}
        </Text>
        <Text style={[styles.dateText, { color: color.primary }]}>
          {moment(currentDate).format("DD ")}
        </Text>
        <Text style={styles.dateText}>{moment(currentDate).format("MMM")}</Text>
      </View>

      <TouchableOpacity onPress={goToNextDay} disabled={isNextDisabled}>
        <MaterialIcons
          name="keyboard-arrow-right"
          color={isNextDisabled ? color.line : color.text}
          size={30}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  dateView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: 14,
    color: color.text,
    fontWeight: "700",
  },
});
