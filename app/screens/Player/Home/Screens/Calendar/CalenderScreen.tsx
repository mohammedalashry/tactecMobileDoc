import React from "react";
import SharedCalendarScreen from "screens/common/calendar/CalendarScreen";

/**
 * Player-specific calendar screen that delegates to the shared implementation
 * Note: The file name has a typo "Calender" vs "Calendar" which is kept for
 * backward compatibility with existing navigation
 */
const CalenderScreen = ({ navigation }) => {
  return <SharedCalendarScreen navigation={navigation} />;
};

export default CalenderScreen;
