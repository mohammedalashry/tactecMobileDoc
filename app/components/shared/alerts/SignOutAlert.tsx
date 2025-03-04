// components/shared/alerts/SignOutAlert.tsx
import React from "react";
import { Alert } from "./Alert";
import I18n from "i18n-js";

interface SignOutAlertProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Reusable alert for sign out confirmation
 */
export const SignOutAlert: React.FC<SignOutAlertProps> = ({
  isVisible,
  onConfirm,
  onCancel,
}) => {
  return (
    <Alert
      isVisible={isVisible}
      title={I18n.t("menu.signOut")}
      message={I18n.t("menu.signOutConfirm")}
      primaryButtonText={I18n.t("common.yes")}
      secondaryButtonText={I18n.t("common.no")}
      onPrimaryAction={onConfirm}
      onSecondaryAction={onCancel}
      onDismiss={onCancel}
      type="warning"
    />
  );
};
