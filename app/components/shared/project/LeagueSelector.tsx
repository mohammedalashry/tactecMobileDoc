import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { color } from "theme";
import I18n from "i18n-js";

interface League {
  label: string;
  value: string;
  icon?: string;
  id?: string;
}

interface LeagueSelectorProps {
  /**
   * Array of league options
   */
  leagues: League[];

  /**
   * Currently selected league
   */
  selectedLeague: string | null;

  /**
   * Callback when league changes
   */
  onLeagueChange: (league: League) => void;

  /**
   * Optional label text
   */
  label?: string;

  /**
   * Whether the component is disabled
   */
  disabled?: boolean;
}

/**
 * Component for selecting a league
 */
export const LeagueSelector: React.FC<LeagueSelectorProps> = ({
  leagues,
  selectedLeague,
  onLeagueChange,
  label = I18n.t("common.selectLeague"),
  disabled = false,
}) => {
  const renderItem = (item: League) => (
    <View style={styles.dropdownItem}>
      {item.icon && (
        <Image
          source={{ uri: item.icon }}
          style={styles.leagueIcon}
          resizeMode="contain"
        />
      )}
      <Text style={styles.dropdownText}>{item.label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Dropdown
        style={[styles.dropdown, disabled && styles.disabledDropdown]}
        containerStyle={styles.dropdownContainer}
        data={leagues}
        labelField="label"
        valueField="value"
        value={selectedLeague}
        onChange={onLeagueChange}
        placeholder={I18n.t("common.selectLeague")}
        placeholderStyle={styles.placeholderText}
        selectedTextStyle={styles.selectedText}
        renderItem={renderItem}
        disable={disabled}
        search
        searchPlaceholder={I18n.t("common.search")}
        searchPlaceholderStyle={styles.searchPlaceholder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: color.text,
    marginBottom: 12,
  },
  dropdown: {
    height: 50,
    backgroundColor: color.blackbg,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: color.line,
  },
  disabledDropdown: {
    opacity: 0.5,
  },
  dropdownContainer: {
    backgroundColor: color.blackbg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.line,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: color.line,
  },
  dropdownText: {
    fontSize: 14,
    color: color.text,
    flex: 1,
  },
  placeholderText: {
    fontSize: 14,
    color: color.line,
  },
  selectedText: {
    fontSize: 14,
    color: color.text,
  },
  leagueIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: color.line,
  },
});
