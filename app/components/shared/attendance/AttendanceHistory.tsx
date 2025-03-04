import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";
import { color } from "theme";
import { AttendanceHistory } from "hooks/attendance/useAttendance";
import I18n from "i18n-js";

interface AttendanceHistoryProps {
  data: AttendanceHistory[];
}

/**
 * Component for displaying a player's attendance history
 */
export const AttendanceHistoryList: React.FC<AttendanceHistoryProps> = ({
  data,
}) => {
  // Render column headers
  const renderHeader = () => (
    <View style={styles.headerView}>
      <Text style={styles.headerText}>{I18n.t("Players.Attendance.Date")}</Text>
      <Text style={styles.headerText}>{I18n.t("Players.Attendance.Day")}</Text>
      <Text style={styles.headerText}>
        {I18n.t("Players.Attendance.TimeIn")}
      </Text>
      <Text style={styles.headerText}>
        {I18n.t("Players.Attendance.Session")}
      </Text>
      <Text style={styles.headerText}>
        {I18n.t("Players.Attendance.Leave")}
      </Text>
    </View>
  );

  // Render a single history row
  const renderItem = ({ item }: ListRenderItemInfo<AttendanceHistory>) => (
    <View
      style={[
        styles.card,
        { backgroundColor: item.backgroundColor || color.background },
      ]}
    >
      <View style={styles.dateContainer}>
        <Text style={styles.textHighlight}>{item.date[0]} </Text>
        <Text style={styles.text}>{item.date[1]}</Text>
      </View>
      <Text style={styles.text}>{item.day}</Text>
      <Text style={styles.textHighlight}>{item.timeIn}</Text>
      <Text style={styles.textHighlight}>{item.session}</Text>
      <Text style={styles.textHighlight}>{item.leave}</Text>
    </View>
  );

  // Render empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {I18n.t("Players.Attendance.NoHistory")}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerView: {
    flexDirection: "row",
    backgroundColor: color.blackbg,
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 1,
  },
  headerText: {
    fontSize: 14,
    alignSelf: "center",
    color: color.line,
    fontStyle: "italic",
  },
  card: {
    flexDirection: "row",
    width: "100%",
    height: 60,
    justifyContent: "space-around",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
  },
  text: {
    color: color.text,
    fontSize: 14,
  },
  textHighlight: {
    color: color.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: color.text,
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
});
