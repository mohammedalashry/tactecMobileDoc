import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {color} from 'theme';
import {formatAMPM} from 'utils/dates/date';
import I18n from 'i18n-js';

export interface TrainingCardProps {
  /**
   * Training data
   */
  training: {
    _id: string;
    title: string;
    date: string | Date;
    images?: {url: string}[];
    description?: string;
  };

  /**
   * Function to handle training selection
   */
  onSelect: (trainingId: string) => void;
}

/**
 * A reusable training card component for displaying training information
 */
export const TrainingCard: React.FC<TrainingCardProps> = ({
  training,
  onSelect,
}) => {
  const handlePress = () => {
    onSelect(training._id);
  };

  // Format the date
  const trainingDate = new Date(training.date);
  const dateString = trainingDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
  const timeString = formatAMPM(trainingDate);

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {training.images && training.images.length > 0 ? (
            <Image
              source={{uri: training.images[0].url}}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                {I18n.t('common.noImage')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {training.title}
          </Text>

          {training.description && (
            <Text
              style={styles.description}
              numberOfLines={1}
              ellipsizeMode="tail">
              {training.description}
            </Text>
          )}

          <View style={styles.dateContainer}>
            <Text style={styles.date}>{dateString}</Text>
            <Text style={styles.time}>{timeString}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: color.cardbg,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: color.black,
  },
  imageContainer: {
    width: 120,
    height: 90,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: color.primarybg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: color.text,
    fontSize: 12,
    fontStyle: 'italic',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    color: color.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  description: {
    color: color.primaryLight,
    fontSize: 12,
    marginVertical: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  date: {
    color: color.primary,
    fontSize: 12,
  },
  time: {
    color: color.primary,
    fontSize: 12,
  },
});
