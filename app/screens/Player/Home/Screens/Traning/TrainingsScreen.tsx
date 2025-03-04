import React, {useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {color} from 'theme';
import {DetailScreen} from 'components/shared/layout/DetailScreen';
import {ItemList} from 'components/shared/lists/ItemList';
import {SearchBar} from 'components/shared/search/SearchBar';
import {TrainingCard} from 'components/shared/cards/TrainingCard';
import {useTrainingsList} from 'hooks/trainings/useTrainingsList';
import I18n from 'i18n-js';

const PlayerTrainingsScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const {trainings, isLoading, hasNextPage, fetchNextPage, refetch} =
    useTrainingsList();

  // Filter trainings based on search query
  const filteredTrainings = trainings.filter(training =>
    training.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleTrainingSelect = (trainingId: string) => {
    navigation.navigate('PlayerTrainingScreen', {_id: trainingId});
  };

  const renderTrainingItem = (training, index) => (
    <TrainingCard
      key={training._id}
      training={training}
      onSelect={handleTrainingSelect}
    />
  );

  return (
    <DetailScreen
      title={I18n.t('tabs.Training')}
      loading={false}
      showBackButton={false}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={I18n.t('common.search')}
      />

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={color.primary} size="large" />
        </View>
      ) : (
        <ItemList
          data={filteredTrainings}
          renderItem={renderTrainingItem}
          keyExtractor={item => item._id}
          onEndReached={fetchNextPage}
          hasNextPage={hasNextPage}
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

export default PlayerTrainingsScreen;
