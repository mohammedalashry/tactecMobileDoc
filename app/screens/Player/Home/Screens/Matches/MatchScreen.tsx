import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {color} from 'theme';
import {DetailScreen} from 'components/shared/layout/DetailScreen';
import {useMatchDetail} from 'hooks/matches/useMatchDetail';
import {ImageCarousel} from 'components/shared/media/ImageCarousel';
import I18n from 'i18n-js';
import {formatAMPM} from 'utils/dates/date';

const PlayerMatchDetailScreen = ({route, navigation}) => {
  const {
    match,
    isLoading,
    activeSlide,
    setActiveSlide,
    playerMatchStarting,
    substitution,
  } = useMatchDetail(route);

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Format match details
  const matchDate = match?.date
    ? new Date(match.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const matchTime = match?.date ? formatAMPM(new Date(match.date)) : '';

  return (
    <DetailScreen
      title={match?.title || I18n.t('common.matchDetails')}
      loading={isLoading}
      showBackButton={true}
      onBackPress={handleBackPress}
      scrollable={true}>
      {match && (
        <ScrollView style={styles.container}>
          {/* Match Overview Section */}
          <View style={styles.overviewSection}>
            <Text style={styles.title}>{match.title}</Text>

            <View style={styles.matchInfoContainer}>
              <View style={styles.matchInfoItem}>
                <Text style={styles.matchInfoLabel}>
                  {I18n.t('common.date')}
                </Text>
                <Text style={styles.matchInfoValue}>{matchDate}</Text>
              </View>

              <View style={styles.matchInfoItem}>
                <Text style={styles.matchInfoLabel}>
                  {I18n.t('common.time')}
                </Text>
                <Text style={styles.matchInfoValue}>{matchTime}</Text>
              </View>

              {match.venue && (
                <View style={styles.matchInfoItem}>
                  <Text style={styles.matchInfoLabel}>
                    {I18n.t('common.venue')}
                  </Text>
                  <Text style={styles.matchInfoValue}>{match.venue}</Text>
                </View>
              )}

              {match.opponent && (
                <View style={styles.matchInfoItem}>
                  <Text style={styles.matchInfoLabel}>
                    {I18n.t('common.opponent')}
                  </Text>
                  <Text style={styles.matchInfoValue}>{match.opponent}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Images Section */}
          {match.images && match.images.length > 0 && (
            <View style={styles.imagesSection}>
              <ImageCarousel
                images={match.images}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
                editable={false}
              />
            </View>
          )}

          {/* Players Section */}
          {(playerMatchStarting.length > 0 || substitution.length > 0) && (
            <View style={styles.playersSection}>
              <View style={styles.playersContainer}>
                <View style={styles.playersColumn}>
                  <Text style={styles.playersTitle}>
                    {I18n.t('common.startingLineup')}
                  </Text>
                  {playerMatchStarting.map((player, index) => (
                    <View key={player._id || index} style={styles.playerRow}>
                      <Text style={styles.playerNumber}>
                        {player.shirtNumber}
                      </Text>
                      <Text
                        style={[
                          styles.playerPosition,
                          {
                            color:
                              player.position === 'GK'
                                ? 'yellow'
                                : player.position === 'CB'
                                ? '#0172A6'
                                : player.position === 'DMF'
                                ? '#00E40A'
                                : 'red',
                          },
                        ]}>
                        {player.position}
                      </Text>
                      <Text style={styles.playerName} numberOfLines={1}>
                        {player.name}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.divider} />

                <View style={styles.playersColumn}>
                  <Text style={styles.playersTitle}>
                    {I18n.t('common.substitutes')}
                  </Text>
                  {substitution.map((player, index) => (
                    <View key={player._id || index} style={styles.playerRow}>
                      <Text style={styles.playerNumber}>
                        {player.shirtNumber}
                      </Text>
                      <Text
                        style={[
                          styles.playerPosition,
                          {
                            color:
                              player.position === 'GK'
                                ? 'yellow'
                                : player.position === 'CB'
                                ? '#0172A6'
                                : player.position === 'DMF'
                                ? '#00E40A'
                                : 'red',
                          },
                        ]}>
                        {player.position}
                      </Text>
                      <Text style={styles.playerName} numberOfLines={1}>
                        {player.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </DetailScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overviewSection: {
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: color.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  matchInfoContainer: {
    backgroundColor: color.blackbg,
    borderRadius: 8,
    padding: 16,
  },
  matchInfoItem: {
    marginBottom: 12,
  },
  matchInfoLabel: {
    fontSize: 14,
    color: color.primaryLight,
    marginBottom: 4,
  },
  matchInfoValue: {
    fontSize: 16,
    color: color.text,
  },
  imagesSection: {
    marginVertical: 16,
  },
  playersSection: {
    padding: 16,
    backgroundColor: color.blackbg,
    marginVertical: 16,
    borderRadius: 8,
  },
  playersContainer: {
    flexDirection: 'row',
  },
  playersColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  divider: {
    width: 1,
    backgroundColor: color.linewellness,
  },
  playersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.primaryLight,
    marginBottom: 12,
    textAlign: 'center',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  playerNumber: {
    width: '20%',
    fontSize: 14,
    fontWeight: 'bold',
    color: color.primary,
  },
  playerPosition: {
    width: '20%',
    fontSize: 14,
    fontWeight: 'bold',
  },
  playerName: {
    width: '60%',
    fontSize: 14,
    fontWeight: 'bold',
    color: color.text,
  },
});

export default PlayerMatchDetailScreen;
