import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {color} from 'theme';
import {DetailScreen} from 'components/shared/layout/DetailScreen';
import {useTrainingDetail} from 'hooks/trainings/useTrainingDetail';
import {ImageCarousel} from 'components/shared/media/ImageCarousel';
import I18n from 'i18n-js';
import {formatAMPM} from 'utils/dates/date';

const PlayerTrainingDetailScreen = ({route, navigation}) => {
  const {
    training,
    isLoading,
    activeSlide,
    setActiveSlide,
    updateImageDescription,
  } = useTrainingDetail(route);

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Format training date
  const trainingDate = training?.date
    ? new Date(training.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const trainingTime = training?.date
    ? formatAMPM(new Date(training.date))
    : '';

  return (
    <DetailScreen
      title={training?.title || I18n.t('common.trainingDetails')}
      loading={isLoading}
      showBackButton={true}
      onBackPress={handleBackPress}
      scrollable={true}>
      {training && (
        <ScrollView style={styles.container}>
          <Text style={styles.title}>{training.title}</Text>

          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeItem}>
              <Text style={styles.dateTimeLabel}>{I18n.t('common.date')}</Text>
              <Text style={styles.dateTimeValue}>{trainingDate}</Text>
            </View>

            <View style={styles.dateTimeItem}>
              <Text style={styles.dateTimeLabel}>{I18n.t('common.time')}</Text>
              <Text style={styles.dateTimeValue}>{trainingTime}</Text>
            </View>
          </View>

          {training.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>
                {I18n.t('common.description')}
              </Text>
              <Text style={styles.description}>{training.description}</Text>
            </View>
          )}

          {training.images && training.images.length > 0 && (
            <View style={styles.carouselContainer}>
              <ImageCarousel
                images={training.images}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
                editable={false}
                onDescriptionChange={updateImageDescription}
              />
            </View>
          )}

          {training.players && training.players.length > 0 && (
            <View style={styles.playersContainer}>
              <Text style={styles.playersLabel}>
                {I18n.t('common.participants')}
              </Text>
              <View style={styles.playersList}>
                {training.players.map((player, index) => (
                  <View key={player._id || index} style={styles.playerItem}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    {player.position && (
                      <Text style={styles.playerPosition}>
                        {player.position}
                      </Text>
                    )}
                  </View>
                ))}
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: color.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    backgroundColor: color.blackbg,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  dateTimeItem: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: 14,
    color: color.primaryLight,
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 16,
    color: color.text,
  },
  descriptionContainer: {
    backgroundColor: color.blackbg,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: color.text,
    lineHeight: 20,
  },
  carouselContainer: {
    marginVertical: 16,
  },
  playersContainer: {
    backgroundColor: color.blackbg,
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
  },
  playersLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.text,
    marginBottom: 12,
  },
  playersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  playerItem: {
    width: '50%',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  playerName: {
    fontSize: 14,
    color: color.text,
    fontWeight: 'bold',
  },
  playerPosition: {
    fontSize: 12,
    color: color.primary,
    marginTop: 4,
  },
});

export default PlayerTrainingDetailScreen;
