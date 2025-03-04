import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {color} from 'theme';
import {formatAMPM} from 'utils/dates/date';
import I18n from 'i18n-js';

export interface TaskCardProps {
  /**
   * Task data
   */
  task: {
    _id: string;
    title: string;
    date: string | Date;
    images?: {url: string}[];
  };

  /**
   * Function to handle task selection
   */
  onSelect: (taskId: string) => void;
}

/**
 * A reusable task card component for displaying task information
 */
export const TaskCard: React.FC<TaskCardProps> = ({task, onSelect}) => {
  const handlePress = () => {
    onSelect(task._id);
  };

  // Format the date
  const taskDate = new Date(task.date);
  const dateString = taskDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
  const timeString = formatAMPM(taskDate);

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {task.images && task.images.length > 0 ? (
            <Image
              source={{uri: task.images[0].url}}
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
            {task.title}
          </Text>

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
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
