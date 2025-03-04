import React from "react";
import SharedAttendanceProfileScreen from "screens/common/attendance/AttendanceProfileScreen";

/**
 * Tactical-specific AttendanceProfileScreen delegates to the shared implementation
 */
const TacticalAttendanceProfileScreen = ({ route, navigation }) => {
  return (
    <SharedAttendanceProfileScreen route={route} navigation={navigation} />
  );
};

export default TacticalAttendanceProfileScreen;
