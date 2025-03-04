import React from "react";
import SharedAttendanceScreen from "screens/common/attendance/AttendanceScreen";

/**
 * Tactical-specific AttendanceScreen delegates to the shared implementation
 */
const TacticalAttendanceScreen = ({ navigation }) => {
  return <SharedAttendanceScreen navigation={navigation} />;
};

export default TacticalAttendanceScreen;
