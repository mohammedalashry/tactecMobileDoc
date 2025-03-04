// components/shared/lists/ItemList.tsx
import React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  ListRenderItem,
} from 'react-native';
import {color, padding, typography} from 'theme';
import I18n from 'i18n-js';

interface ItemListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement;
  keyExtractor?: (item: T, index: number) => string;
  onEndReached?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  viewabilityConfig?: any;
  viewabilityConfigCallbackPairs?: any;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  contentContainerStyle?: object;
}

export function ItemList<T>({
  data,
  renderItem,
  keyExtractor = (item: any, index) => item?.id?.toString() || index.toString(),
  onEndReached,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  refreshing,
  onRefresh,
  ListEmptyComponent,
  viewabilityConfig,
  viewabilityConfigCallbackPairs,
  ListHeaderComponent,
  ListFooterComponent,
  contentContainerStyle,
}: ItemListProps<T>) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color.primary} />
      </View>
    );
  }

  // Create a properly typed renderItem function for FlatList
  const renderItemForFlatList: ListRenderItem<T> = ({item, index}) =>
    renderItem(item, index);

  // Default empty component as a React element
  const DefaultEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{I18n.t('common.noItems')}</Text>
    </View>
  );

  // Function to render the footer
  const renderFooter = () => {
    return (
      <View>
        {/* Render ListFooterComponent if it exists */}
        {ListFooterComponent && React.isValidElement(ListFooterComponent)
          ? ListFooterComponent
          : ListFooterComponent
          ? React.createElement(ListFooterComponent as React.ComponentType)
          : null}

        {/* Render loading indicator if fetching next page */}
        {isFetchingNextPage && (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={color.primary} />
          </View>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItemForFlatList}
      keyExtractor={keyExtractor}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      refreshing={refreshing}
      onRefresh={onRefresh}
      viewabilityConfig={viewabilityConfig}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={ListEmptyComponent || <DefaultEmptyComponent />}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
    />
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.background,
  },
  footerLoader: {
    paddingVertical: padding.large,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: padding.huge,
    backgroundColor: color.background,
  },
  emptyText: {
    color: color.text,
    fontSize: 16,
    fontFamily: typography.primary,
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: color.background,
  },
});
