// components/shared/forms/FormField.tsx
import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {color, typography, margin, padding, palette} from 'theme';

interface FormFieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: (e: any) => void; // Add this line
  placeholder?: string;
  error?: string;
  touched?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  maxLength?: number;
  icon?: React.ReactNode;
  style?: object;
}

export const FormField = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  touched,
  secureTextEntry,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  maxLength,
  icon,
  style,
  onBlur, // Add this line
}: FormFieldProps) => {
  const hasError = !!error && touched;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          hasError && styles.inputError,
          !editable && styles.inputDisabled,
        ]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={color.placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          maxLength={maxLength}
          onBlur={onBlur} // Add this line
        />
        {icon}
      </View>

      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
// components/shared/forms/FormField.tsx (updated styles)
const styles = StyleSheet.create({
  container: {
    marginBottom: margin.base,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontFamily: typography.primary,
    color: color.text,
    marginBottom: margin.tiny,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: 10,
    backgroundColor: color.primarybg,
    paddingHorizontal: padding.small,
  },
  input: {
    flex: 1,
    color: color.text,
    fontSize: 14,
    fontFamily: typography.primary,
    paddingVertical: padding.medium,
  },
  inputError: {
    borderColor: palette.angry,
  },
  inputDisabled: {
    backgroundColor: color.uploadImgbg,
  },
  errorText: {
    color: palette.angry,
    fontSize: 12,
    fontFamily: typography.primary,
    marginTop: margin.tiny,
  },
});
