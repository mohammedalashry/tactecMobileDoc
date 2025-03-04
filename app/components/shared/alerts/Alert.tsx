// components/shared/alerts/Alert.tsx
import React from 'react';
import {View, Modal, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {color, padding, typography, margin, buttonColors} from 'theme';

interface AlertProps {
  isVisible: boolean;
  title: string;
  message?: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
  onDismiss: () => void;
  children?: React.ReactNode;
  type?: 'default' | 'warning' | 'success' | 'error';
}

export const Alert = ({
  isVisible,
  title,
  message,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryAction,
  onSecondaryAction,
  onDismiss,
  children,
  type = 'default',
}: AlertProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onDismiss}>
      <View style={styles.centeredView}>
        <View style={styles.modal}>
          <Text style={styles.modalText}>{title}</Text>
          {message && <Text style={styles.messageText}>{message}</Text>}

          {children}

          <View style={styles.modalButton}>
            <TouchableOpacity
              style={[styles.button, getButtonStyle(type)]}
              onPress={onPrimaryAction}>
              <Text style={styles.buttonText}>{primaryButtonText}</Text>
            </TouchableOpacity>

            {secondaryButtonText && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={onSecondaryAction || onDismiss}>
                <Text style={styles.buttonText}>{secondaryButtonText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getButtonStyle = type => {
  switch (type) {
    case 'warning':
      return {backgroundColor: buttonColors.warning};
    case 'success':
      return {backgroundColor: buttonColors.success};
    case 'error':
      return {backgroundColor: buttonColors.error};
    default:
      return {backgroundColor: color.primary};
  }
};
// components/shared/alerts/Alert.tsx (updated styles)
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: color.blackbg,
    width: '90%',
    borderRadius: 10,
    padding: padding.large,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: color.border,
  },
  modalText: {
    fontSize: 18,
    fontFamily: typography.bold,
    color: color.text,
    marginBottom: margin.medium,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 14,
    fontFamily: typography.primary,
    color: color.text,
    marginBottom: margin.large,
    textAlign: 'center',
  },
  modalButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: margin.large,
  },
  button: {
    borderRadius: 20,
    padding: padding.medium,
    minWidth: 100,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: color.line,
  },
  buttonText: {
    color: color.text,
    fontFamily: typography.bold,
  },
});
