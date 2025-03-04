// screens/Tactical/Players/Screens/Profiles/ProfilesScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SearchBar } from "components/shared/search/SearchBar";
import { BaseScreen } from "components/shared/layout/BaseScreen";
import { Avatar } from "components/shared/media/Avatar";
import { ItemList } from "components/shared/lists/ItemList";
import { color } from "theme";
import { useTacticalProfilesList } from "hooks/tactical/profiles/useTacticalProfilesList";
import I18n from "i18n-js";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TacticalRouteParams } from "navigation/types/route-params";

type ProfilesScreenProps = NativeStackScreenProps<
  TacticalRouteParams,
  "ProfilesScreen"
>;

/**
 * Screen for displaying a list of player profiles for tactical role
 */
const ProfilesScreen = ({ navigation }: ProfilesScreenProps) => {
  const {
    players,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    searchQuery,
    setSearchQuery,
    selectedSort,
    sortOrder,
    handleSort,
    fetchNextPage,
    navigateToProfileDetails,
    refetch,
  } = useTacticalProfilesList(navigation);

  // Define the sort options
  const sortOptions = [
    { id: "name", label: I18n.t("common.name") },
    { id: "position", label: I18n.t("player.position") },
    { id: "shirtNumber", label: I18n.t("player.shirtNumber") },
  ];

  // Render player item for the list
  const renderPlayerItem = (player, index) => {
    return (
      <TouchableOpacity
        style={[
          styles.playerItem,
          { backgroundColor: player.backgroundColor || color.blackbg },
        ]}
        onPress={() => navigateToProfileDetails(player._id)}
      >
        <View style={styles.playerInfo}>
          <Avatar uri={player.profileImage} size={50} placeholder="person" />
          <View style={styles.playerDetails}>
            <Text style={styles.playerName}>{player.name}</Text>
            {player.position && (
              <Text style={styles.playerPosition}>{player.position}</Text>
            )}
          </View>
        </View>
        <View style={styles.playerStats}>
          {player.shirtNumber && (
            <View style={styles.shirtNumber}>
              <Text style={styles.shirtNumberText}>{player.shirtNumber}</Text>
            </View>
          )}
          <MaterialIcons name="chevron-right" size={24} color={color.text} />
        </View>
      </TouchableOpacity>
    );
  };

  // Render sort options header
  const renderSortHeader = () => (
    <View style={styles.sortHeader}>
      <Text style={styles.sortLabel}>{I18n.t("common.sortBy")}</Text>
      <View style={styles.sortOptions}>
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.sortOption,
              selectedSort === option.id && styles.sortOptionSelected,
            ]}
            onPress={() => handleSort(option.id)}
          >
            <Text
              style={[
                styles.sortOptionText,
                selectedSort === option.id && styles.sortOptionTextSelected,
              ]}
            >
              {option.label}
            </Text>
            {selectedSort === option.id && (
              <MaterialIcons
                name={sortOrder === "asc" ? "arrow-upward" : "arrow-downward"}
                size={16}
                color={color.primary}
                style={styles.sortIcon}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <BaseScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{I18n.t("player.playerProfiles")}</Text>
        </View>

        {/* Search bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={I18n.t("common.searchPlayers")}
          style={styles.searchBar}
        />

        {/* Sort options */}
        {renderSortHeader()}

        {/* Players list */}
        <ItemList
          data={players}
          renderItem={renderPlayerItem}
          keyExtractor={(item) => item._id}
          onEndReached={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
          refreshing={false}
          onRefresh={refetch}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyList}>
                <Text style={styles.emptyListText}>
                  {searchQuery
                    ? I18n.t("player.noPlayersFound")
                    : I18n.t("player.noPlayers")}
                </Text>
              </View>
            ) : null
          }
          contentContainerStyle={styles.listContent}
        />
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
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: color.text,
  },
  searchBar: {
    marginBottom: 8,
  },
  sortHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: color.blackbg,
    marginBottom: 8,
  },
  sortLabel: {
    fontSize: 14,
    color: color.text,
    marginBottom: 8,
  },
  sortOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: color.background,
    marginRight: 8,
    marginBottom: 8,
  },
  sortOptionSelected: {
    backgroundColor: color.primary + "20", // 20% opacity
    borderColor: color.primary,
    borderWidth: 1,
  },
  sortOptionText: {
    color: color.text,
    fontSize: 14,
  },
  sortOptionTextSelected: {
    color: color.primary,
    fontWeight: "500",
  },
  sortIcon: {
    marginLeft: 4,
  },
  listContent: {
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
  playerStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  shirtNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: color.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  shirtNumberText: {
    color: color.text,
    fontSize: 14,
    fontWeight: "bold",
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
});
export default ProfilesScreen;
