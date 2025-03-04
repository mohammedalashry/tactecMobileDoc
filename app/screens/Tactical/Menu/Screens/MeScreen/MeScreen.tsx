import React from "react";
import SharedMeScreen from "screens/common/profile/MeScreen";

/**
 * Tactical-specific MeScreen that delegates to the shared implementation
 */
const TacticalMeScreen = ({ navigation }) => {
  return (
    <SharedMeScreen
      navigation={navigation}
      showCovidField={false}
      showEditButton={true}
      role="tactical"
    />
  );
};

export default TacticalMeScreen;
