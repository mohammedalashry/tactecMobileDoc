// screens/Tactical/Home/Screens/Reports/ReportsScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BaseScreen } from "components/shared/layout/BaseScreen";
import { SearchBar } from "components/shared/search/SearchBar";
import { color, padding, margin } from "theme";
import { useTacticalReports } from "hooks/tactical/reports/useTacticalReports";
import I18n from "i18n-js";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { formatDate } from "utils/dateTime";
import { TacticalRouteParams } from "navigation/types/route-params";

type ReportsScreenProps = NativeStackScreenProps<
  TacticalRouteParams,
  "ReportsScreen"
>;

/**
 * Reports screen for tactical role
 */
const ReportsScreen = ({ navigation }: ReportsScreenProps) => {
  const {
    reports,
    isLoading,

    isFetchingNextPage,
    searchQuery,
    selectedReportType,
    setSearchQuery,
    setSelectedReportType,
    fetchNextPage,
    navigateToReportDetails,
    navigateToCreateReport,
    refetch,
  } = useTacticalReports(navigation);

  // Report type options
  const reportTypes = [
    { id: null, label: I18n.t("report.all") },
    { id: "match", label: I18n.t("report.match") },
    { id: "training", label: I18n.t("report.training") },
    { id: "player", label: I18n.t("report.player") },
    { id: "team", label: I18n.t("report.team") },
  ];

  // Render report item for the list
  const renderReportItem = ({ item }) => (
    <TouchableOpacity
      style={styles.reportItem}
      onPress={() => navigateToReportDetails(item._id)}
    >
      <View style={styles.reportHeader}>
        <Text style={styles.reportTitle}>{item.title}</Text>
        <View style={styles.reportType}>
          <Text style={styles.reportTypeText}>{item.type}</Text>
        </View>
      </View>

      <View style={styles.reportContent}>
        <Text style={styles.reportDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>

      <View style={styles.reportFooter}>
        <View style={styles.reportDateContainer}>
          <MaterialIcons
            name="calendar-today"
            size={16}
            color={color.primary}
          />
          <Text style={styles.reportDate}>{formatDate(item.date)}</Text>
        </View>

        {item.fileUrl && (
          <View style={styles.fileIndicator}>
            <MaterialIcons name="attach-file" size={16} color={color.primary} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Render filter options
  const renderFilterOptions = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterLabel}>{I18n.t("report.filterByType")}</Text>
      <FlatList
        data={reportTypes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedReportType === item.id && styles.filterOptionSelected,
            ]}
            onPress={() => setSelectedReportType(item.id)}
          >
            <Text
              style={[
                styles.filterOptionText,
                selectedReportType === item.id &&
                  styles.filterOptionTextSelected,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => (item.id ? item.id : "all")}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
      />
    </View>
  );

  return (
    <BaseScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{I18n.t("report.reports")}</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={navigateToCreateReport}
          >
            <MaterialIcons name="add" size={20} color={color.text} />
            <Text style={styles.createButtonText}>
              {I18n.t("report.createNew")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={I18n.t("report.searchReports")}
          style={styles.searchBar}
        />

        {/* Filter options */}
        {renderFilterOptions()}

        {/* Reports list */}
        <FlatList
          data={reports}
          renderItem={renderReportItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.2}
          refreshing={isLoading && !isFetchingNextPage}
          onRefresh={refetch}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.loadingMore}>
                <Text style={styles.loadingMoreText}>
                  {I18n.t("common.loadingMore")}
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyList}>
                <MaterialIcons
                  name="description"
                  size={48}
                  color={color.primaryLight}
                />
                <Text style={styles.emptyListText}>
                  {searchQuery || selectedReportType
                    ? I18n.t("report.noReportsFound")
                    : I18n.t("report.noReports")}
                </Text>
                <TouchableOpacity
                  style={styles.emptyCreateButton}
                  onPress={navigateToCreateReport}
                >
                  <Text style={styles.emptyCreateButtonText}>
                    {I18n.t("report.createFirst")}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: padding.medium,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: color.text,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  createButtonText: {
    color: color.text,
    fontWeight: "500",
    fontSize: 14,
    marginLeft: 4,
  },
  searchBar: {
    marginBottom: margin.small,
  },
  filterContainer: {
    padding: padding.medium,
    paddingTop: 0,
  },
  filterLabel: {
    fontSize: 14,
    color: color.text,
    marginBottom: margin.small,
  },
  filterList: {
    paddingVertical: padding.small,
  },
  filterOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: color.blackbg,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  filterOptionSelected: {
    backgroundColor: color.primary + "20", // 20% opacity
    borderColor: color.primary,
  },
  filterOptionText: {
    color: color.text,
    fontSize: 14,
  },
  filterOptionTextSelected: {
    color: color.primary,
    fontWeight: "500",
  },
  listContent: {
    padding: padding.medium,
    paddingTop: 0,
  },
  reportItem: {
    backgroundColor: color.blackbg,
    borderRadius: 8,
    padding: padding.medium,
    marginBottom: margin.medium,
    borderLeftWidth: 4,
    borderLeftColor: color.primary,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: margin.small,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: color.text,
    flex: 1,
  },
  reportType: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: color.primary + "40", // 40% opacity
  },
  reportTypeText: {
    fontSize: 12,
    color: color.primary,
    fontWeight: "500",
  },
  reportContent: {
    marginBottom: margin.small,
  },
  reportDescription: {
    fontSize: 14,
    color: color.text,
    lineHeight: 20,
  },
  reportFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reportDate: {
    fontSize: 12,
    color: color.primaryLight,
    marginLeft: 4,
  },
  fileIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptyList: {
    padding: padding.large,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyListText: {
    color: color.primaryLight,
    fontSize: 16,
    textAlign: "center",
    marginTop: margin.medium,
    marginBottom: margin.medium,
  },
  emptyCreateButton: {
    backgroundColor: color.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  emptyCreateButtonText: {
    color: color.text,
    fontWeight: "500",
  },
  loadingMore: {
    padding: padding.medium,
    alignItems: "center",
  },
  loadingMoreText: {
    color: color.primaryLight,
    fontSize: 14,
  },
});

export default ReportsScreen;
