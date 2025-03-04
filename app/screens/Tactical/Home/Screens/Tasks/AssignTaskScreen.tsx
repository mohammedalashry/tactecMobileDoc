// screens/Tactical/Home/Screens/Tasks/AssignTaskScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DetailScreen } from "components/shared/layout/DetailScreen";
import { SearchBar } from "components/shared/search/SearchBar";
import { Alert } from "components/shared/alerts/Alert";
import { Avatar } from "components/shared/media/Avatar";
import { color } from "theme";
import { useTacticalAssignTask } from "hooks/tactical/tasks/useTacticalAssignTask";
import I18n from "i18n-js";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TacticalRouteParams } from "navigation/types/route-params";
import { formatDate, formatTime } from "utils/dateTime";

type AssignTaskScreenProps = NativeStackScreenProps<
  TacticalRouteParams,
  "AssignTaskScreen"
>;

/**
 * Screen for assigning tasks to players
 */
const AssignTaskScreen = ({ route, navigation }: AssignTaskScreenProps) => {
  const {
    task,
    isLoading,
    players,
    selectedPlayers,
    toggleSelectAll,
    isAllSelected,
    togglePlayerSelection,
    handleConfirm,
    handleCancel,
    isAssigning,
    confirmationVisible,
    setConfirmationVisible,
  } = useTacticalAssignTask(route, navigation);

  // Render header right component with select all button
  const renderHeaderRight = () => (
    <TouchableOpacity style={styles.selectAllButton} onPress={toggleSelectAll}>
      {isAllSelected ? (
        <MaterialIcons name="check-box" size={22} color={color.primary} />
      ) : (
        <MaterialIcons
          name="check-box-outline-blank"
          size={22}
          color={color.text}
        />
      )}
      <Text style={styles.selectAllText}>{I18n.t("common.selectAll")}</Text>
    </TouchableOpacity>
  );

  // Render player item
  const renderPlayerItem = ({ item, index }) => {
    const isSelected = selectedPlayers.includes(item._id as never);

    return (
      <TouchableOpacity
        style={[
          styles.playerItem,
          { backgroundColor: item.backgroundColor || color.blackbg },
        ]}
        onPress={() => togglePlayerSelection(item._id)}
      >
        <View style={styles.playerInfo}>
          <Avatar uri={item.profileImage} size={40} placeholder="person" />
          <View style={styles.playerDetails}>
            <Text style={styles.playerName}>{item.name}</Text>
            {item.position && (
              <Text style={styles.playerPosition}>{item.position}</Text>
            )}
          </View>
        </View>
        <View style={styles.checkbox}>
          {isSelected ? (
            <MaterialIcons name="check-box" size={24} color={color.primary} />
          ) : (
            <MaterialIcons
              name="check-box-outline-blank"
              size={24}
              color={color.text}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Render task details section
  const renderTaskDetails = () => (
    <View style={styles.taskDetails}>
      <Text style={styles.taskTitle}>{task?.title}</Text>
      <View style={styles.taskInfo}>
        <View style={styles.taskInfoItem}>
          <MaterialIcons
            name="calendar-today"
            size={16}
            color={color.primary}
          />
          <Text style={styles.taskInfoText}>{formatDate(task?.date)}</Text>
        </View>
        <View style={styles.taskInfoItem}>
          <MaterialIcons name="access-time" size={16} color={color.primary} />
          <Text style={styles.taskInfoText}>{formatTime(task?.date)}</Text>
        </View>
      </View>
    </View>
  );

  // Render footer with action buttons
  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={handleCancel}
        disabled={isAssigning}
      >
        <Text style={styles.cancelButtonText}>{I18n.t("common.cancel")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.confirmButton,
          (selectedPlayers.length === 0 || isAssigning) &&
            styles.disabledButton,
        ]}
        onPress={handleConfirm}
        disabled={selectedPlayers.length === 0 || isAssigning}
      >
        {isAssigning ? (
          <ActivityIndicator size="small" color={color.text} />
        ) : (
          <Text style={styles.confirmButtonText}>
            {I18n.t("common.confirm")}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <DetailScreen
      title={I18n.t("task.assignTask")}
      loading={isLoading}
      headerRight={renderHeaderRight()}
    >
      <View style={styles.container}>
        {/* Task Details */}
        {task && renderTaskDetails()}

        {/* Player Selection */}
        <View style={styles.playersList}>
          <View style={styles.playersHeader}>
            <Text style={styles.playersTitle}>
              {I18n.t("task.selectPlayers")}
            </Text>
            <Text style={styles.selectedCount}>
              {I18n.t("task.selectedCount", { count: selectedPlayers.length })}
            </Text>
          </View>

          {/* Search Bar */}
          <SearchBar
            value=""
            onChangeText={() => {}}
            placeholder={I18n.t("common.searchPlayers")}
          />

          {/* Players List */}
          <FlatList
            data={players}
            renderItem={renderPlayerItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.playersListContent}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Text style={styles.emptyListText}>
                  {I18n.t("common.noPlayers")}
                </Text>
              </View>
            }
          />
        </View>

        {/* Footer with buttons */}
        {renderFooter()}

        {/* Assignment Confirmation Alert */}
        <Alert
          isVisible={confirmationVisible}
          title={I18n.t("task.assignmentSuccess")}
          message={I18n.t("task.assignmentSuccessDetail", {
            count: selectedPlayers.length,
          })}
          primaryButtonText={I18n.t("common.done")}
          onPrimaryAction={() => {
            setConfirmationVisible(false);
            navigation.goBack();
          }}
          onDismiss={() => {
            setConfirmationVisible(false);
            navigation.goBack();
          }}
          type="success"
        />
      </View>
    </DetailScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  selectAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  selectAllText: {
    color: color.text,
    fontSize: 14,
    marginLeft: 4,
  },
  taskDetails: {
    backgroundColor: color.blackbg,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: color.text,
    marginBottom: 8,
  },
  taskInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  taskInfoText: {
    color: color.text,
    fontSize: 14,
    marginLeft: 4,
  },
  playersList: {
    flex: 1,
    backgroundColor: color.blackbg,
    borderRadius: 8,
    overflow: "hidden",
  },
  playersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  playersTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: color.text,
  },
  selectedCount: {
    fontSize: 14,
    color: color.primary,
  },
  playersListContent: {
    paddingBottom: 16,
  },
  playerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  playerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    color: color.text,
    fontWeight: "500",
  },
  playerPosition: {
    fontSize: 14,
    color: color.primaryLight,
    marginTop: 2,
  },
  checkbox: {
    padding: 4,
  },
  emptyList: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyListText: {
    color: color.primaryLight,
    fontSize: 16,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: color.blackbg,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 8,
    borderWidth: 1,
    borderColor: color.border,
  },
  cancelButtonText: {
    color: color.text,
    fontSize: 16,
    fontWeight: "500",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: color.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginLeft: 8,
  },
  confirmButtonText: {
    color: color.text,
    fontSize: 16,
    fontWeight: "500",
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default AssignTaskScreen;
