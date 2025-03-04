// components/shared/notifications/SentList.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  Modal,
} from "react-native";
import { color, margin, padding } from "theme";
import { useSentNotifications } from "hooks/notifications/useNotifications";
import { Notification } from "hooks/notifications/useNotifications";
import I18n from "i18n-js";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { format } from "date-fns";

interface SentListProps {
  navigation: any;
}

/**
 * Component for displaying a list of sent notifications with ability to send new ones
 */
export const SentList: React.FC<SentListProps> = ({ navigation }) => {
  const {
    notifications,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    showSendDialog,
    description,
    loadSendingNotification,
    setDescription,
    openSendDialog,
    cancelSend,
    sendNotification,
    refetch,
  } = useSentNotifications(navigation);

  // Render send dialog
  const renderSendDialog = () => (
    <Modal
      visible={showSendDialog}
      transparent
      animationType="fade"
      onRequestClose={cancelSend}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {I18n.t("notification.newNotification")}
            </Text>
            <TouchableOpacity onPress={cancelSend} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={color.text} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.messageInput}
            placeholder={I18n.t("notification.enterMessage")}
            placeholderTextColor={color.primaryLight}
            multiline
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelSend}
              disabled={loadSendingNotification}
            >
              <Text style={styles.cancelButtonText}>
                {I18n.t("common.cancel")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!description.trim() || loadSendingNotification) &&
                  styles.disabledButton,
              ]}
              onPress={sendNotification}
              disabled={!description.trim() || loadSendingNotification}
            >
              {loadSendingNotification ? (
                <ActivityIndicator size="small" color={color.text} />
              ) : (
                <Text style={styles.sendButtonText}>
                  {I18n.t("notification.send")}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Render notification item
  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const date = new Date(item.createdAt);
    const formattedDate = format(date, "MMM d, yyyy • h:mm a");

    return (
      <View style={styles.notificationItem}>
        <View style={styles.notificationHeader}>
          <View style={styles.recipientInfo}>
            {item.recipient && (
              <Text style={styles.recipientName}>
                {I18n.t("notification.to")}: {item.recipient.name}
              </Text>
            )}
            <Text style={styles.notificationDate}>{formattedDate}</Text>
          </View>
        </View>

        <Text style={styles.notificationContent}>{item.description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Send button */}
      <TouchableOpacity style={styles.newButton} onPress={openSendDialog}>
        <MaterialIcons name="add" size={20} color={color.text} />
        <Text style={styles.newButtonText}>
          {I18n.t("notification.newNotification")}
        </Text>
      </TouchableOpacity>

      {/* List of sent notifications */}
      {isLoading && notifications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.2}
          refreshing={isLoading && notifications.length > 0}
          onRefresh={refetch}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.loadingMore}>
                <ActivityIndicator size="small" color={color.primary} />
                <Text style={styles.loadingMoreText}>
                  {I18n.t("notification.loadingMore")}
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyContainer}>
                <MaterialIcons
                  name="send"
                  size={48}
                  color={color.primaryLight}
                />
                <Text style={styles.emptyText}>
                  {I18n.t("notification.noSentNotifications")}
                </Text>
              </View>
            ) : null
          }
        />
      )}

      {/* Send dialog modal */}
      {renderSendDialog()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  newButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-end",
    margin: margin.medium,
  },
  newButtonText: {
    color: color.text,
    fontWeight: "500",
    marginLeft: 4,
  },
  listContent: {
    padding: padding.medium,
    paddingTop: 0,
    flexGrow: 1,
  },
  notificationItem: {
    backgroundColor: color.blackbg,
    borderRadius: 8,
    padding: padding.medium,
    marginBottom: margin.medium,
  },
  notificationHeader: {
    marginBottom: margin.small,
  },
  recipientInfo: {},
  recipientName: {
    color: color.primary,
    fontWeight: "500",
    fontSize: 14,
    marginBottom: 2,
  },
  notificationDate: {
    color: color.primaryLight,
    fontSize: 12,
  },
  notificationContent: {
    color: color.text,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: padding.large,
  },
  emptyText: {
    color: color.primaryLight,
    fontSize: 16,
    marginTop: margin.medium,
    textAlign: "center",
  },
  loadingMore: {
    padding: padding.medium,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  loadingMoreText: {
    color: color.primaryLight,
    fontSize: 14,
    marginLeft: margin.small,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: padding.medium,
  },
  modalContent: {
    width: "100%",
    backgroundColor: color.blackbg,
    borderRadius: 8,
    padding: padding.medium,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: margin.medium,
  },
  modalTitle: {
    color: color.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  messageInput: {
    backgroundColor: color.background,
    borderRadius: 8,
    padding: padding.medium,
    color: color.text,
    fontSize: 16,
    minHeight: 150,
    borderWidth: 1,
    borderColor: color.border,
    marginBottom: margin.medium,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    color: color.text,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: color.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  sendButtonText: {
    color: color.text,
    fontSize: 16,
    fontWeight: "500",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
