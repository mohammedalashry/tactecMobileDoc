import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { color } from "theme";
import { DetailScreen } from "components/shared/layout/DetailScreen";
import { Button } from "components/shared";
import { Checkbox } from "react-native-paper";
import I18n from "i18n-js";
import { useTacticalAssignTraining } from "hooks/tactical/trainings/useTacticalAssignTraining";
import { Alert } from "components/shared/alerts/Alert";

const AssignTrainingScreen = ({ route, navigation }) => {
  const {
    training,
    isLoading,
    players,
    selectedPlayers,
    toggleSelectAll,
    togglePlayerSelection,
    handleConfirm,
    handleCancel,
    isAssigning,
    confirmationVisible,
    setConfirmationVisible,
  } = useTacticalAssignTraining(route, navigation);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderPlayer = ({ item }) => (
    <View
      key={item._id}
      style={[
        styles.playerItem,
        { backgroundColor: item.backgroundColor || color.background },
      ]}
    >
      <Checkbox.Android
        status={
          selectedPlayers.includes(item._id as never) ? "checked" : "unchecked"
        }
        uncheckedColor="#D9D9D9"
        color={color.blue}
        onPress={() => togglePlayerSelection(item._id)}
      />
      <Text style={[styles.playerText, { color: color.primary }]}>
        {item.shirtNumber}
      </Text>
      <Text style={styles.playerText}>{item.position}</Text>
      <Text style={styles.playerText}>{item.name}</Text>
    </View>
  );

  return (
    <DetailScreen
      title={I18n.t("trainings.assignTraining")}
      loading={isLoading}
      showBackButton={true}
      onBackPress={handleBackPress}
      scrollable={false}
    >
      <View style={styles.container}>
        {training && (
          <>
            <View style={styles.trainingPreview}>
              <Image
                style={styles.trainingImage}
                source={
                  training.images && training.images.length > 0
                    ? { uri: training.images[0].url }
                    : require("@assets/images/Traning/counterAttacking.png")
                }
              />
              <View style={styles.trainingDetails}>
                <Text style={styles.trainingTitle}>{training.title}</Text>
                <View style={styles.dateContainer}>
                  {training.date && (
                    <Text style={styles.dateText}>
                      {new Date(training.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.selectHeader}>
              <TouchableOpacity onPress={toggleSelectAll}>
                <Text style={styles.selectAllText}>
                  {I18n.t("common.selectAll")}
                </Text>
              </TouchableOpacity>
              <Text style={styles.selectedCount}>
                {selectedPlayers.length} {I18n.t("players.selected")}
              </Text>
            </View>

            <View style={styles.playersList}>
              <FlatList
                data={players}
                renderItem={renderPlayer}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                text={I18n.t("common.confirm")}
                onPress={handleConfirm}
                style={styles.confirmButton}
                loading={isAssigning}
              />
              <Button
                text={I18n.t("common.cancel")}
                onPress={handleCancel}
                style={styles.cancelButton}
              />
            </View>

            <Alert
              isVisible={confirmationVisible}
              title={I18n.t("trainings.trainingAssigned")}
              message={I18n.t("trainings.trainingAssignedMessage")}
              primaryButtonText={I18n.t("common.ok")}
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
          </>
        )}
      </View>
    </DetailScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  trainingPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.blackbg,
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  trainingImage: {
    width: 75,
    height: 50,
    resizeMode: "contain",
    marginRight: 15,
  },
  trainingDetails: {
    flex: 1,
  },
  trainingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: color.text,
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: "row",
  },
  dateText: {
    fontSize: 14,
    color: color.text,
  },
  selectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  selectAllText: {
    color: color.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedCount: {
    color: color.primaryLight,
    fontSize: 14,
  },
  playersList: {
    flex: 1,
    backgroundColor: color.blackbg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: color.line,
    overflow: "hidden",
    marginBottom: 20,
  },
  listContent: {
    paddingVertical: 8,
  },
  playerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: color.line,
  },
  playerText: {
    fontSize: 14,
    color: color.text,
    marginLeft: 12,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 20,
  },
  confirmButton: {
    width: 140,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.blue,
  },
  cancelButton: {
    width: 140,
    height: 40,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: color.line,
  },
});

export default AssignTrainingScreen;
