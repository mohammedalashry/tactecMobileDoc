// components/shared/date-time/DateTimePicker.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import I18n from 'i18n-js';
import {color, padding, typography, margin} from 'theme';

interface DateTimePickerProps {
  dateValue: {
    day: string;
    month: string;
    year: string;
  };
  timeValue: {
    hours: string;
    minutes: string;
    ampm: string;
  };
  onDateChange: (field: string, value: string) => void;
  onTimeChange: (field: string, value: string) => void;
  showDate?: boolean;
  showTime?: boolean;
  labelDate?: string;
  labelTime?: string;
}

export const DateTimePicker = ({
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  showDate = true,
  showTime = true,
  labelDate = I18n.t('Home.Date'),
  labelTime = I18n.t('Home.Time'),
}: DateTimePickerProps) => {
  // Generate options arrays
  const dayOptions = Array.from({length: 31}, (_, i) => ({
    label: String(i + 1).padStart(2, '0'),
    value: String(i + 1),
  }));

  const monthOptions = [
    {label: 'January', value: '1'},
    {label: 'February', value: '2'},
    {label: 'March', value: '3'},
    {label: 'April', value: '4'},
    {label: 'May', value: '5'},
    {label: 'June', value: '6'},
    {label: 'July', value: '7'},
    {label: 'August', value: '8'},
    {label: 'September', value: '9'},
    {label: 'October', value: '10'},
    {label: 'November', value: '11'},
    {label: 'December', value: '12'},
  ];

  const yearOptions = Array.from({length: 10}, (_, i) => ({
    label: String(new Date().getFullYear() - 5 + i),
    value: String(new Date().getFullYear() - 5 + i),
  }));

  const hourOptions = Array.from({length: 12}, (_, i) => ({
    label: String(i + 1).padStart(2, '0'),
    value: String(i + 1),
  }));

  const minuteOptions = Array.from({length: 60}, (_, i) => ({
    label: String(i).padStart(2, '0'),
    value: String(i),
  }));

  const ampmOptions = [
    {label: 'AM', value: 'am'},
    {label: 'PM', value: 'pm'},
  ];

  return (
    <View style={styles.container}>
      {showDate && (
        <View style={styles.row}>
          <Text style={styles.label}>{labelDate}:</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownList}
              selectedTextStyle={styles.selectedText}
              data={dayOptions}
              labelField="label"
              valueField="value"
              placeholder="Day"
              value={dateValue.day}
              onChange={item => onDateChange('day', item.value)}
            />
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownList}
              selectedTextStyle={styles.selectedText}
              data={monthOptions}
              labelField="label"
              valueField="value"
              placeholder="Month"
              value={dateValue.month}
              onChange={item => onDateChange('month', item.value)}
            />
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownList}
              selectedTextStyle={styles.selectedText}
              data={yearOptions}
              labelField="label"
              valueField="value"
              placeholder="Year"
              value={dateValue.year}
              onChange={item => onDateChange('year', item.value)}
            />
          </View>
        </View>
      )}

      {showTime && (
        <View style={styles.row}>
          <Text style={styles.label}>{labelTime}:</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownList}
              selectedTextStyle={styles.selectedText}
              data={hourOptions}
              labelField="label"
              valueField="value"
              placeholder="HH"
              value={timeValue.hours}
              onChange={item => onTimeChange('hours', item.value)}
            />
            <Text style={styles.colon}>:</Text>
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownList}
              selectedTextStyle={styles.selectedText}
              data={minuteOptions}
              labelField="label"
              valueField="value"
              placeholder="MM"
              value={timeValue.minutes}
              onChange={item => onTimeChange('minutes', item.value)}
            />
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownList}
              selectedTextStyle={styles.selectedText}
              data={ampmOptions}
              labelField="label"
              valueField="value"
              placeholder="AM"
              value={timeValue.ampm}
              onChange={item => onTimeChange('ampm', item.value)}
            />
          </View>
        </View>
      )}
    </View>
  );
};
// components/shared/date-time/DateTimePicker.tsx (updated styles)
const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: margin.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: margin.small,
  },
  label: {
    fontSize: 14,
    fontFamily: typography.primary,
    color: color.text,
    marginRight: margin.medium,
    width: 50,
  },
  dropdownContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  dropdown: {
    flex: 1,
    height: 40,
    backgroundColor: color.blackbg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.border,
    paddingHorizontal: padding.small,
    marginHorizontal: margin.tiny,
  },
  dropdownList: {
    backgroundColor: color.black,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.border,
  },
  selectedText: {
    color: color.text,
    fontSize: 12,
    fontFamily: typography.primary,
    textAlign: 'center',
  },
  colon: {
    color: color.text,
    fontSize: 16,
    fontFamily: typography.primary,
    marginHorizontal: margin.tiny,
  },
});
