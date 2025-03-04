import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {color} from 'theme';
import {DetailScreen} from 'components/shared/layout/DetailScreen';
import {ItemList} from 'components/shared/lists/ItemList';
import {MatchCard} from 'components/shared/cards/MatchCard';
import {useMatchesList} from 'hooks/matches/useMatchesList';
import I18n from 'i18n-js';

const PlayerMatchesScreen = ({navigation}) => {
  const {
    matches,
    currentMatchDate,
    isLoading,
    hasNextPage,
    fetchNextPage,
    viewabilityConfigCallbackPairs,
    refetch,
  } = useMatchesList();

  const handleMatchSelect = (matchId: string) => {
    navigation.navigate('PlayerMatchScreen', {_id: matchId});
  };

  const renderMatchItem = (match, index) => (
    <MatchCard
      key={match._id || index}
      match={match}
      onSelect={handleMatchSelect}
    />
  );

  return (
    <DetailScreen
      title={I18n.t('tabs.Matches')}
      loading={false}
      showBackButton={false}>
      <View style={styles.monthView}>
        <Text style={styles.monthText}>{currentMatchDate}</Text>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={color.primary} size="large" />
        </View>
      ) : (
        <ItemList
          data={matches}
          renderItem={renderMatchItem}
          keyExtractor={item => item._id}
          onEndReached={fetchNextPage}
          hasNextPage={hasNextPage}
          refreshing={isLoading}
          onRefresh={refetch}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
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
  monthView: {
    width: 140,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.blackbg,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  monthText: {
    color: color.text,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PlayerMatchesScreen;
