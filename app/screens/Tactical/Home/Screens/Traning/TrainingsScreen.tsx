import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { color } from "theme";
import { SearchBar } from "components/shared/search/SearchBar";
import { ItemList } from "components/shared/lists/ItemList";
import { TrainingCard } from "components/shared/cards/TrainingCard";
import { useTacticalTrainingsList } from "hooks/tactical/trainings/useTacticalTrainingsList";
import I18n from "i18n-js";

const TrainingsScreen = ({ navigation }) => {
  const {
    trainings,
    isLoading,
    searchQuery,
    setSearchQuery,
    hasNextPage,
    fetchNextPage,
    navigateToTrainingDetails,
    navigateToCreateTraining,
  } = useTacticalTrainingsList(navigation);

  const renderTrainingItem = (training) => (
    <TrainingCard
      key={training._id}
      training={training}
      onSelect={navigateToTrainingDetails}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={I18n.t("trainings.searchTrainings")}
          style={styles.searchBar}
        />
      </View>

      <ItemList
        data={trainings}
        renderItem={renderTrainingItem}
        keyExtractor={(item) => item._id}
        onEndReached={fetchNextPage}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        refreshing={isLoading}
        onRefresh={() => {}}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {I18n.t("trainings.noTrainings")}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={navigateToCreateTraining}
      >
        <Image
          source={require("@assets/images/Player/Plus.png")}
          style={styles.addIcon}
        />
        <Text style={styles.addText}>{I18n.t("trainings.createTraining")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  header: {
    width: "100%",
    backgroundColor: color.blackbg,
    padding: 10,
  },
  searchBar: {
    height: 60,
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: color.text,
    fontSize: 16,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    backgroundColor: color.blackbg,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: color.line,
    elevation: 4,
  },
  addIcon: {
    width: 16,
    height: 16,
    tintColor: color.primary,
    marginRight: 8,
  },
  addText: {
    color: color.text,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default TrainingsScreen;
