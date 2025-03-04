import React, {useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {color} from 'theme';
import {DetailScreen} from 'components/shared/layout/DetailScreen';
import {ItemList} from 'components/shared/lists/ItemList';
import {SearchBar} from 'components/shared/search/SearchBar';
import {TaskCard} from 'components/shared/cards/TaskCard';
import {useTasksList} from 'hooks/tasks/useTasksList';
import I18n from 'i18n-js';

const PlayerTasksScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    tasks,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useTasksList();

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleTaskSelect = (taskId: string) => {
    navigation.navigate('PlayerTaskScreen', {_id: taskId});
  };

  const renderTaskItem = (task, index) => (
    <TaskCard key={task._id || index} task={task} onSelect={handleTaskSelect} />
  );

  return (
    <DetailScreen
      title={I18n.t('tabs.Tasks')}
      loading={false}
      showBackButton={false}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={I18n.t('common.searchTasks')}
      />

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={color.primary} size="large" />
        </View>
      ) : (
        <ItemList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={item => item._id}
          onEndReached={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          refreshing={isLoading}
          onRefresh={refetch}
          contentContainerStyle={styles.listContent}
        />
      )}
    </DetailScreen>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
});

export default PlayerTasksScreen;
