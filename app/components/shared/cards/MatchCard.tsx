import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {color} from 'theme';
import {formatAMPM} from 'utils/dates/date';
import I18n from 'i18n-js';

export interface MatchCardProps {
  /**
   * Match data
   */
  match: {
    _id: string;
    title: string;
    date: string | Date;
    opponent?: string;
    home?: boolean;
    venue?: string;
  };

  /**
   * Function to handle match selection
   */
  onSelect: (matchId: string) => void;
}

/**
 * A reusable match card component for displaying match information
 */
export const MatchCard: React.FC<MatchCardProps> = ({match, onSelect}) => {
  const handlePress = () => {
    onSelect(match._id);
  };

  // Format the date
  const matchDate = new Date(match.date);
  const dateString = matchDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
  const timeString = formatAMPM(matchDate);

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.card}>
        <View style={styles.dateSection}>
          <Text style={styles.day}>{matchDate.getDate()}</Text>
          <Text style={styles.month}>
            {matchDate.toLocaleDateString('en-US', {month: 'short'})}
          </Text>
          <Text style={styles.time}>{timeString}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.contentSection}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {match.title}
          </Text>

          {match.opponent && (
            <View style={styles.matchupContainer}>
              <Text style={styles.teamName}>
                {match.home ? 'Home' : 'Away'}
              </Text>
              <Text style={styles.vs}>{I18n.t('common.vs')}</Text>
              <Text style={styles.teamName}>{match.opponent}</Text>
            </View>
          )}

          {match.venue && (
            <Text style={styles.venue} numberOfLines={1}>
              {match.venue}
            </Text>
          )}
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
  dateSection: {
    width: 80,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.blackbg,
  },
  day: {
    color: color.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  month: {
    color: color.text,
    fontSize: 14,
  },
  time: {
    color: color.primary,
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: color.border,
  },
  contentSection: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    color: color.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  matchupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  teamName: {
    color: color.text,
    fontSize: 12,
  },
  vs: {
    color: color.primary,
    fontSize: 12,
    marginHorizontal: 8,
  },
  venue: {
    color: color.primaryLight,
    fontSize: 12,
    marginTop: 4,
  },
});
