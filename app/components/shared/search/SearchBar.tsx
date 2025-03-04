import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {color, padding} from 'theme';
import I18n from 'i18n-js';

interface SearchBarProps {
  /**
   * Current search value
   */
  value: string;

  /**
   * Function to handle text changes
   */
  onChangeText: (text: string) => void;

  /**
   * Optional placeholder text
   */
  placeholder?: string;

  /**
   * Optional function to handle clear button press
   */
  onClear?: () => void;

  /**
   * Whether to show the clear button
   */
  showClearButton?: boolean;

  /**
   * Additional style for the container
   */
  style?: object;
}

/**
 * A reusable search bar component
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = I18n.t('common.search'),
  onClear,
  showClearButton = true,
  style,
}) => {
  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchView}>
        <Image
          style={styles.searchIcon}
          source={require('@assets/images/Tasks/bx_search.png')}
        />

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={color.placeholder}
          autoCapitalize="none"
          returnKeyType="search"
        />

        {showClearButton && value.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Image
              style={styles.clearIcon}
              source={require('@assets/images/icons_calendar.png')}
              // If you don't have this icon, you can use a fallback or create a simple X icon
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    backgroundColor: color.blackbg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  searchView: {
    flexDirection: 'row',
    width: '90%',
    height: 40,
    borderRadius: 20,
    borderColor: color.line,
    borderWidth: 1,
    backgroundColor: color.background,
    alignItems: 'center',
    paddingHorizontal: padding.small,
  },
  searchIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    color: color.text,
    fontSize: 14,
  },
  clearButton: {
    padding: 8,
  },
  clearIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: color.text,
  },
});
