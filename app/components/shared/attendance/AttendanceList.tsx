import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { color } from "theme";
import { AttendanceRecord } from "hooks/attendance/useAttendance";
import { Avatar } from "components/shared/media/Avatar";
import I18n from "i18n-js";

interface AttendanceListProps {
  data: AttendanceRecord[];
  onSelectPlayer: (playerId: string) => void;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

/**
 * Reusable component for displaying a list of attendance records
 */
export const AttendanceList: React.FC<AttendanceListProps> = ({
  data,
  onSelectPlayer,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}) => {
  // Render a single attendance row
  const renderItem = ({
    item,
    index,
  }: {
    item: AttendanceRecord;
    index: number;
  }) => {
    const backgroundColor = index % 2 === 0 ? color.blackbg : color.background;

    return (
      <TouchableOpacity
        style={[styles.row, { backgroundColor }]}
        onPress={() => onSelectPlayer(item.player._id)}
      >
        {/* Player info */}
        <View style={styles.playerInfo}>
          <Avatar
            uri={item.player.profileImage}
            size={40}
            placeholder="person"
          />
          <Text style={styles.playerName}>{item.player.name}</Text>
        </View>

        {/* Position & Number */}
        <View style={styles.positionContainer}>
          <Text style={styles.value}>{item.player.position}</Text>
          <Text style={styles.value}>{item.player.shirtNumber}</Text>
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: item.present ? color.primary : "#FF3B30" },
            ]}
          />
          <Text style={styles.statusText}>
            {item.present
              ? I18n.t("attendance.present")
              : I18n.t("attendance.absent")}
          </Text>
        </View>

        {/* Time */}
        <Text style={styles.timeText}>{item.timeIn || "-"}</Text>
      </TouchableOpacity>
    );
  };

  // Render list footer (load more indicator)
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;

    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={color.primary} />
      </View>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{I18n.t("attendance.noRecords")}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      onEndReached={hasNextPage ? fetchNextPage : null}
      onEndReachedThreshold={0.3}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  playerInfo: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  playerName: {
    color: color.text,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
  },
  positionContainer: {
    flex: 1,
    alignItems: "center",
  },
  statusContainer: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    color: color.text,
    fontSize: 12,
  },
  timeText: {
    flex: 1,
    color: color.primary,
    fontSize: 12,
    textAlign: "center",
  },
  value: {
    color: color.text,
    fontSize: 12,
  },
  footerContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: color.text,
    fontSize: 14,
  },
});
