import React from "react";
import { View, StyleSheet } from "react-native";
import { color } from "theme";
import { useCalendar } from "hooks/calendar/useCalendar";
import { EventCalendar } from "components/shared/calendar/EventCalendar";
import { BaseScreen } from "components/shared/layout/BaseScreen";

interface CalendarScreenProps {
  navigation: any;
  initialDate?: string;
  showHeader?: boolean;
  title?: string;
}

/**
 * A shared calendar screen that displays events from different categories
 */
const CalendarScreen: React.FC<CalendarScreenProps> = ({
  navigation,
  initialDate,
  showHeader = false,
  title = "Calendar",
}) => {
  const { events, isLoading, loadItems, navigateToEvent } = useCalendar();

  return (
    <BaseScreen backgroundColor={color.background}>
      <View style={styles.container}>
        <EventCalendar
          events={events}
          isLoading={isLoading}
          loadItems={loadItems}
          navigateToEvent={navigateToEvent}
          initialDate={initialDate}
        />
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
});

export default CalendarScreen;
