import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { color } from "theme";
import { usePlayerAttendance } from "hooks/attendance/useAttendance";
import { AttendanceHistoryList } from "components/shared/attendance/AttendanceHistory";
import { BaseScreen } from "components/shared/layout/BaseScreen";
import { Avatar } from "components/shared/media/Avatar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import I18n from "i18n-js";

interface AttendanceProfileScreenProps {
  route: any;
  navigation: any;
}

/**
 * Screen for displaying a player's attendance history
 */
const AttendanceProfileScreen: React.FC<AttendanceProfileScreenProps> = ({
  route,
  navigation,
}) => {
  const { playerId } = route.params;
  const { playerDetails, attendanceHistory, isLoading } =
    usePlayerAttendance(playerId);

  return (
    <BaseScreen backgroundColor={color.background}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={require("@assets/images/Screenshot1.png")} />

          <View style={styles.headerCard}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View style={styles.back}>
                <MaterialIcons
                  name="keyboard-arrow-left"
                  size={20}
                  color={color.text}
                />
                <Text style={styles.text}>{I18n.t("Player.Back")}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={color.primary} />
          </View>
        ) : (
          <>
            {/* Player details */}
            <View style={styles.playerDetail}>
              <View style={styles.profileContainer}>
                <Avatar
                  uri={playerDetails?.profileImage}
                  size={80}
                  placeholder="person"
                />
                <Text style={styles.name}>{playerDetails?.name}</Text>
                <View style={styles.playerInfo}>
                  <Text style={styles.infoText}>
                    {playerDetails?.shirtNumber}
                  </Text>
                  <Text style={styles.infoText}>{playerDetails?.position}</Text>
                </View>
              </View>
            </View>

            {/* Attendance history */}
            <AttendanceHistoryList data={attendanceHistory} />
          </>
        )}
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  header: {
    width: "100%",
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.blackbg,
  },
  headerCard: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
  },
  back: {
    flexDirection: "row",
    width: "35%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: color.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  playerDetail: {
    width: "100%",
    height: 150,
    backgroundColor: color.blackbg,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: color.text,
    marginTop: 10,
  },
  playerInfo: {
    flexDirection: "row",
    width: 100,
    justifyContent: "space-around",
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "700",
    color: color.primary,
  },
});

export default AttendanceProfileScreen;
