import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {Alert} from 'components/shared/alerts/Alert';
import {color} from 'theme';
import I18n from 'i18n-js';

interface MedicalComplaintDialogProps {
  /**
   * Whether the dialog is visible
   */
  isVisible: boolean;

  /**
   * Function to handle dialog dismissal
   */
  onDismiss: () => void;

  /**
   * Function to handle complaint submission
   */
  onSubmit: () => void;

  /**
   * Current complaint text
   */
  complaintText: string;

  /**
   * Function to handle complaint text changes
   */
  onComplaintTextChange: (text: string) => void;

  /**
   * Whether a submission is in progress
   */
  isSubmitting?: boolean;
}

/**
 * Dialog component for submitting medical complaints
 */
export const MedicalComplaintDialog: React.FC<MedicalComplaintDialogProps> = ({
  isVisible,
  onDismiss,
  onSubmit,
  complaintText,
  onComplaintTextChange,
  isSubmitting = false,
}) => {
  // Handle text length validation
  const [error, setError] = useState<string | null>(null);

  const handleTextChange = (text: string) => {
    onComplaintTextChange(text);

    // Clear error when text is valid
    if (text.trim().length > 0) {
      setError(null);
    }
  };

  const handleSubmit = () => {
    // Validate complaint text
    if (!complaintText.trim()) {
      setError(I18n.t('validation.complaintRequired'));
      return;
    }

    // Submit complaint
    onSubmit();
  };

  return (
    <Alert
      isVisible={isVisible}
      title={I18n.t('medical.submitComplaint')}
      primaryButtonText={I18n.t('common.submit')}
      secondaryButtonText={I18n.t('common.cancel')}
      onPrimaryAction={handleSubmit}
      onSecondaryAction={onDismiss}
      onDismiss={onDismiss}
      type="default">
      <View style={styles.container}>
        <Text style={styles.label}>{I18n.t('medical.describeIssue')}</Text>

        <TextInput
          style={styles.input}
          placeholder={I18n.t('medical.complaintPlaceholder')}
          placeholderTextColor={color.placeholder}
          value={complaintText}
          onChangeText={handleTextChange}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        {isSubmitting && (
          <Text style={styles.submittingText}>
            {I18n.t('common.submitting')}
          </Text>
        )}
      </View>
    </Alert>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 8,
  },
  label: {
    fontSize: 14,
    color: color.text,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 120,
    backgroundColor: color.primarybg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.border,
    color: color.text,
    padding: 12,
    fontSize: 14,
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  submittingText: {
    color: color.primary,
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
