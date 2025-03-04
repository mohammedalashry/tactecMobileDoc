import React from "react";
import SharedMeScreen from "screens/common/profile/MeScreen";

/**
 * Player-specific MeScreen that delegates to the shared implementation
 */
const PlayerMeScreen = ({ navigation }) => {
  return (
    <SharedMeScreen
      navigation={navigation}
      showCovidField={true}
      showEditButton={false}
      role="player"
    />
  );
};

export default PlayerMeScreen;
