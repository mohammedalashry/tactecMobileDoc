import React, { useState } from "react";
import { View, TextInput, Image, StyleSheet } from "react-native";
import { color } from "theme";
import { useAttendance } from "hooks/attendance/useAttendance";
import { AttendanceList } from "components/shared/attendance/AttendanceList";
import { DateSelector } from "components/shared/date/DateSelector";
import { BaseScreen } from "components/shared/layout/BaseScreen";
import I18n from "i18n-js";

interface AttendanceScreenProps {
  navigation: any;
}

/**
 * Shared screen for displaying player attendance records
 */
const AttendanceScreen: React.FC<AttendanceScreenProps> = ({ navigation }) => {
  const {
    attendance,
    selectedDate,
    hasNextPage,
    isFetchingNextPage,
    handleDateChange,
    handleSearch,
    fetchNextPage,
    navigateToAttendanceProfile,
  } = useAttendance(navigation);

  const [searchText, setSearchText] = useState("");

  // Handle search input change
  const onSearchChange = (text: string) => {
    setSearchText(text);
    handleSearch(text);
  };

  return (
    <BaseScreen backgroundColor={color.primarybg}>
      <View style={styles.container}>
        <View style={styles.backgroundSearch}>
          {/* Date selector */}
          <DateSelector
            currentDate={selectedDate}
            onDateChange={handleDateChange}
            allowFutureDates={false}
          />

          {/* Search bar */}
          <View style={styles.searchView}>
            <Image
              style={styles.searchIcon}
              source={require("@assets/images/Tasks/bx_search.png")}
            />
            <TextInput
              style={styles.input}
              value={searchText}
              onChangeText={onSearchChange}
              placeholder={I18n.t("common.search")}
              placeholderTextColor={color.line}
            />
          </View>
        </View>

        {/* Attendance list */}
        <AttendanceList
          data={attendance}
          onSelectPlayer={navigateToAttendanceProfile}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </View>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.primarybg,
    zIndex: 0,
  },
  backgroundSearch: {
    width: "100%",
    paddingBottom: 20,
    backgroundColor: color.blackbg,
    alignItems: "center",
    justifyContent: "space-around",
  },
  searchView: {
    flexDirection: "row",
    width: "90%",
    height: 40,
    borderRadius: 20,
    borderColor: color.line,
    borderWidth: 1,
    backgroundColor: color.background,
    alignItems: "center",
    paddingHorizontal: 15,
  },
  searchIcon: {
    width: 26,
    height: 25,
    resizeMode: "contain",
  },
  input: {
    flex: 1,
    height: 40,
    color: color.text,
    fontSize: 14,
    marginLeft: 10,
  },
});

export default AttendanceScreen;
