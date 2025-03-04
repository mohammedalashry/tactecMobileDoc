// components/shared/notifications/ReceivedList.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { color, margin, padding } from "theme";
import { useReceivedNotifications } from "hooks/notifications/useNotifications";
import { Notification } from "hooks/notifications/useNotifications";
import I18n from "i18n-js";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { format } from "date-fns";

interface ReceivedListProps {
  navigation: any;
}

/**
 * Component for displaying a list of received notifications
 */
export const ReceivedList: React.FC<ReceivedListProps> = ({ navigation }) => {
  const {
    notifications,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    handleNotificationNavigation,
    refetch,
  } = useReceivedNotifications(navigation);

  // Render notification item
  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const date = new Date(item.createdAt);
    const formattedDate = format(date, "MMM d, yyyy • h:mm a");

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !item.read && styles.unreadNotification,
        ]}
        onPress={() => handleNotificationNavigation(item)}
      >
        <View style={styles.notificationHeader}>
          <View style={styles.senderInfo}>
            {item.sender && (
              <Text style={styles.senderName}>{item.sender.name}</Text>
            )}
            <Text style={styles.notificationDate}>{formattedDate}</Text>
          </View>
          {!item.read && <View style={styles.unreadIndicator} />}
        </View>

        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationContent} numberOfLines={2}>
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isLoading && notifications.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    );
  }

  return (
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
              name="notifications-none"
              size={48}
              color={color.primaryLight}
            />
            <Text style={styles.emptyText}>
              {I18n.t("notification.noNotifications")}
            </Text>
          </View>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: padding.medium,
    flexGrow: 1,
  },
  notificationItem: {
    backgroundColor: color.blackbg,
    borderRadius: 8,
    padding: padding.medium,
    marginBottom: margin.medium,
    borderLeftWidth: 2,
    borderLeftColor: "transparent",
  },
  unreadNotification: {
    borderLeftColor: color.primary,
    backgroundColor: color.primary + "10", // 10% opacity
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: margin.small,
  },
  senderInfo: {
    flex: 1,
  },
  senderName: {
    color: color.primary,
    fontWeight: "500",
    fontSize: 14,
    marginBottom: 2,
  },
  notificationDate: {
    color: color.primaryLight,
    fontSize: 12,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color.primary,
    marginLeft: margin.small,
  },
  notificationTitle: {
    color: color.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: margin.small,
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
});
