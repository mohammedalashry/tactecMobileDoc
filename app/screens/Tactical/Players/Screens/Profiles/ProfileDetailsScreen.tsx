import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { color } from "theme";
import { DetailScreen } from "components/shared/layout/DetailScreen";
import { Avatar } from "components/shared/media/Avatar";
import { Dropdown } from "react-native-element-dropdown";
import { Button } from "components/shared";
import { FormField } from "components/shared/forms/FormField";
import I18n from "i18n-js";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTacticalProfileDetail } from "hooks/tactical/profiles/useTacticalProfileDetail";
import ProfileAgenda from "components/shared/ProfileAgenda";

const ProfileScreen = ({ route, navigation }) => {
  const {
    playerDetails,
    isLoading,
    isEditing,
    leagues,
    selectedLeague,
    setSelectedLeague,
    formValues,
    handleInputChange,
    redCardsOptions,
    buttonStates,
    handleEdit,
    handleUpdate,
    handleCancel,
    events,
    loadAgendaItems,
  } = useTacticalProfileDetail(route, navigation);

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Right header component with edit button
  const headerRight = (
    <TouchableOpacity
      style={[
        styles.iconButton,
        { borderColor: isEditing ? color.primary : color.text },
      ]}
      onPress={handleEdit}
    >
      <MaterialIcons
        name="edit"
        size={25}
        color={isEditing ? color.primary : color.text}
      />
    </TouchableOpacity>
  );

  return (
    <DetailScreen
      title={playerDetails?.player?.name || I18n.t("players.playerProfile")}
      loading={isLoading}
      showBackButton={true}
      onBackPress={handleBackPress}
      headerRight={headerRight}
      scrollable={true}
    >
      <View style={styles.container}>
        {playerDetails && (
          <>
            <View style={styles.profileHeader}>
              <View style={styles.profileDetails}>
                <Avatar uri={playerDetails?.player?.profileImage} size={60} />
                <Text style={styles.playerName}>
                  {playerDetails?.player?.name}
                </Text>
                <View style={styles.numberPosition}>
                  <Text style={styles.numberText}>
                    {playerDetails?.player?.shirtNumber}
                  </Text>
                  <Text style={styles.positionText}>
                    {playerDetails?.player?.position}
                  </Text>
                </View>
              </View>

              <View style={styles.leagueSelector}>
                <Dropdown
                  style={styles.dropdown}
                  containerStyle={styles.dropdownList}
                  selectedTextStyle={styles.dropdownText}
                  data={leagues}
                  labelField="label"
                  valueField="value"
                  placeholder={I18n.t("players.selectLeague")}
                  value={selectedLeague}
                  onChange={(item) => setSelectedLeague(item.value)}
                  disabled={isLoading}
                />
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <MaterialIcons name="timer" size={24} color={color.text} />
                {isEditing ? (
                  <FormField
                    value={formValues.appearanceTime}
                    onChangeText={(text) =>
                      handleInputChange("appearanceTime", text)
                    }
                    keyboardType="numeric"
                    style={styles.editField}
                  />
                ) : (
                  <Text style={styles.statValue}>
                    {playerDetails?.appearanceTime}
                  </Text>
                )}
                <Text style={styles.statLabel}>
                  {I18n.t("players.appearance")}
                </Text>
              </View>

              <View style={styles.statItem}>
                <View style={styles.yellowCard} />
                {isEditing ? (
                  <FormField
                    value={formValues.yellowCards}
                    onChangeText={(text) =>
                      handleInputChange("yellowCards", text)
                    }
                    keyboardType="numeric"
                    style={styles.editField}
                  />
                ) : (
                  <Text style={styles.statValue}>
                    {playerDetails?.yellowCards}
                  </Text>
                )}
                <Text style={styles.statLabel}>
                  {I18n.t("players.yellowCards")}
                </Text>
              </View>

              <View style={styles.statItem}>
                <View style={styles.redCard} />
                {isEditing ? (
                  <Dropdown
                    style={styles.redCardDropdown}
                    containerStyle={styles.dropdownList}
                    selectedTextStyle={styles.dropdownText}
                    data={redCardsOptions}
                    labelField="label"
                    valueField="value"
                    value={formValues.redCard}
                    onChange={(item) =>
                      handleInputChange("redCard", item.value)
                    }
                  />
                ) : (
                  <Text style={styles.statValue}>
                    {playerDetails?.redCard ? "YES" : "NO"}
                  </Text>
                )}
                <Text style={styles.statLabel}>
                  {I18n.t("players.redCard")}
                </Text>
              </View>

              <View style={styles.statItem}>
                <MaterialIcons name="healing" size={24} color={color.text} />
                <Text style={styles.statValue}>
                  {playerDetails?.player?.injury ? "YES" : "NO"}
                </Text>
                <Text style={styles.statLabel}>{I18n.t("players.injury")}</Text>
              </View>
            </View>

            {isEditing && (
              <View style={styles.buttonContainer}>
                <Button
                  text={I18n.t("common.cancel")}
                  onPress={handleCancel}
                  style={styles.cancelButton}
                  disabled={buttonStates.isUpdating}
                />
                <Button
                  text={I18n.t("common.save")}
                  onPress={handleUpdate}
                  style={styles.saveButton}
                  loading={buttonStates.isUpdating}
                />
              </View>
            )}

            <View style={styles.agendaContainer}>
              <Text style={styles.sectionTitle}>
                {I18n.t("players.schedule")}
              </Text>
              <ProfileAgenda
                navigation={navigation}
                events={events}
                loadItems={loadAgendaItems}
                navigateToMatch="MatchScreen"
                navigateToTraining="TrainingScreen"
                navigateToTask="TaskScreen"
              />
            </View>
          </>
        )}
      </View>
    </DetailScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 5,
    borderColor: color.line,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  profileDetails: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  playerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: color.text,
    marginTop: 8,
  },
  numberPosition: {
    flexDirection: "row",
    marginTop: 4,
  },
  numberText: {
    fontSize: 16,
    fontWeight: "bold",
    color: color.primary,
    marginRight: 12,
  },
  positionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: color.primary,
  },
  leagueSelector: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  dropdown: {
    height: 40,
    backgroundColor: color.blackbg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.line,
    paddingHorizontal: 8,
  },
  dropdownList: {
    backgroundColor: color.black,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.border,
  },
  dropdownText: {
    color: color.text,
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: color.blackbg,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: color.primary,
    marginVertical: 6,
  },
  statLabel: {
    fontSize: 12,
    color: color.text,
  },
  yellowCard: {
    width: 16,
    height: 24,
    backgroundColor: "yellow",
    borderRadius: 2,
  },
  redCard: {
    width: 16,
    height: 24,
    backgroundColor: "red",
    borderRadius: 2,
  },
  editField: {
    width: 50,
    marginVertical: 4,
  },
  redCardDropdown: {
    width: 70,
    height: 36,
    backgroundColor: color.primarybg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: color.line,
    paddingHorizontal: 8,
    marginVertical: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  saveButton: {
    width: 120,
    height: 40,
    borderRadius: 20,
  },
  cancelButton: {
    width: 120,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.blackbg,
    borderColor: color.line,
    borderWidth: 1,
  },
  agendaContainer: {
    flex: 1,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: color.text,
    marginBottom: 12,
  },
});

export default ProfileScreen;
