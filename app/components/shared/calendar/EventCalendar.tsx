import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Agenda } from "react-native-calendars";
import { color } from "theme";
import I18n from "i18n-js";
import { CalendarEvent } from "services/api/calendarService";
import { MatchCard } from "components/shared/cards/MatchCard";
import { TaskCard } from "components/shared/cards/TaskCard";
import { TrainingCard } from "components/shared/cards/TrainingCard";

interface EventCalendarProps {
  /**
   * Events data grouped by date
   */
  events: { [date: string]: CalendarEvent[] };

  /**
   * Whether events are currently loading
   */
  isLoading: boolean;

  /**
   * Function to load items for a specific month
   */
  loadItems: (date: { month: number; year: number; timestamp: number }) => void;

  /**
   * Function to handle navigation when an event is selected
   */
  navigateToEvent: (event: CalendarEvent) => void;

  /**
   * Initial selected date (optional)
   */
  initialDate?: string;

  /**
   * Custom theme options (optional)
   */
  themeOptions?: any;
}

/**
 * A reusable calendar component that displays events from different categories
 */
export const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  isLoading,
  loadItems,
  navigateToEvent,
  initialDate = new Date().toISOString().split("T")[0],
  themeOptions = {},
}) => {
  // Track current selected date
  const [selectedDate, setSelectedDate] = useState(initialDate);

  // Default theme with custom overrides
  const theme = {
    backgroundColor: color.background,
    calendarBackground: color.blackbg,
    textSectionTitleColor: color.text,
    selectedDayBackgroundColor: color.primary,
    selectedDayTextColor: "#ffffff",
    todayTextColor: color.primary,
    dayTextColor: color.text,
    textDisabledColor: color.line,
    dotColor: color.primary,
    selectedDotColor: "#ffffff",
    arrowColor: color.primary,
    monthTextColor: color.text,
    textMonthFontWeight: "bold",
    textDayFontSize: 14,
    textMonthFontSize: 14,
    textDayHeaderFontSize: 14,
    agendaKnobColor: color.primary,
    ...themeOptions,
  };

  // Render a single event item
  const renderItem = (item: CalendarEvent) => {
    switch (item.type) {
      case "match":
        return (
          <MatchCard
            match={{
              _id: item._id,
              title: item.title,
              date: item.start,
              // Add other match-specific properties if available in the event
            }}
            onSelect={() => navigateToEvent(item)}
          />
        );

      case "task":
        return (
          <TaskCard
            task={{
              _id: item._id,
              title: item.title,
              date: item.start,
              // Add other task-specific properties if available in the event
            }}
            onSelect={() => navigateToEvent(item)}
          />
        );

      case "training":
        return (
          <TrainingCard
            training={{
              _id: item._id,
              title: item.title,
              date: item.start,
              // Add other training-specific properties if available in the event
            }}
            onSelect={() => navigateToEvent(item)}
          />
        );

      default:
        return (
          <View style={styles.defaultItem}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemTime}>
              {new Date(item.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        );
    }
  };

  // Render empty date
  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text style={styles.emptyDateText}>{I18n.t("calendar.noEvents")}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.primary} />
        </View>
      ) : (
        <Agenda
          items={events}
          loadItemsForMonth={loadItems}
          selected={selectedDate}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          renderItem={renderItem}
          renderEmptyDate={renderEmptyDate}
          rowHasChanged={(r1, r2) => r1._id !== r2._id}
          showClosingKnob={true}
          theme={theme}
          pastScrollRange={3}
          futureScrollRange={3}
          renderEmptyData={() => (
            <View style={styles.emptyData}>
              <Text style={styles.emptyDataText}>
                {I18n.t("calendar.selectDate")}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  defaultItem: {
    backgroundColor: color.blackbg,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    color: color.text,
    fontSize: 14,
    fontWeight: "600",
  },
  itemTime: {
    color: color.primary,
    fontSize: 12,
  },
  emptyDate: {
    height: 80,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: color.blackbg,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyDateText: {
    color: color.line,
    fontSize: 14,
    fontStyle: "italic",
  },
  emptyData: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyDataText: {
    color: color.text,
    fontSize: 16,
    marginTop: 20,
  },
});
