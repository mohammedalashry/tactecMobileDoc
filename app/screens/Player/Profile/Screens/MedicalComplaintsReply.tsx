import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {color} from 'theme';
import {DetailScreen} from 'components/shared/layout/DetailScreen';
import {Avatar} from 'components/shared/media/Avatar';
import {useMedicalComplaintDetail} from 'hooks/medical/useMedicalComplaintDetail';
import I18n from 'i18n-js';
import {formatAMPM} from 'utils/dates/date';
import moment from 'moment';

const MedicalComplaintReplyScreen = ({route, navigation}) => {
  const {complaint, isLoading, error} = useMedicalComplaintDetail(
    route.params?._id,
    {autoFetch: true},
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <DetailScreen
      title={I18n.t('medical.complaintDetails')}
      loading={isLoading}
      showBackButton={true}
      onBackPress={handleBackPress}
      scrollable={true}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : complaint ? (
        <ScrollView style={styles.container}>
          {/* Complaint Section */}
          <View style={styles.card}>
            <View style={styles.headerCard}>
              <Avatar
                uri={complaint.player?.profileImage}
                size={40}
                borderWidth={0}
              />
              <Text style={styles.name}>{complaint.player?.name}</Text>
            </View>

            <Text style={styles.content}>{complaint.description}</Text>

            <View style={styles.dateView}>
              <View style={styles.dateGroup}>
                <Text style={styles.dateText}>
                  {moment(complaint.createdAt).format('DD, ')}
                </Text>
                <Text style={[styles.dateText, {color: color.text}]}>
                  {moment(complaint.createdAt).format('MMM')}
                </Text>
              </View>
              <Text style={styles.timeText}>
                {formatAMPM(new Date(complaint.createdAt))}
              </Text>
            </View>
          </View>

          {/* Reply Section */}
          {complaint.reply ? (
            <>
              <Text style={styles.sectionTitle}>{I18n.t('medical.reply')}</Text>

              <View style={styles.replyCard}>
                <Text style={styles.content}>{complaint.reply}</Text>

                <View style={styles.dateView}>
                  <View style={styles.dateGroup}>
                    <Text style={styles.dateText}>
                      {moment(complaint.updatedAt).format('DD, ')}
                    </Text>
                    <Text style={[styles.dateText, {color: color.text}]}>
                      {moment(complaint.updatedAt).format('MMM')}
                    </Text>
                  </View>
                  <Text style={styles.timeText}>
                    {formatAMPM(new Date(complaint.updatedAt))}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.noReplyContainer}>
              <Text style={styles.noReplyText}>
                {I18n.t('medical.noReplyYet')}
              </Text>
            </View>
          )}
        </ScrollView>
      ) : null}
    </DetailScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: color.blackbg,
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    color: color.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  content: {
    color: color.text,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  dateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateGroup: {
    flexDirection: 'row',
  },
  dateText: {
    fontSize: 12,
    color: color.primary,
  },
  timeText: {
    fontSize: 12,
    color: color.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.text,
    marginBottom: 12,
    marginTop: 8,
  },
  replyCard: {
    width: '100%',
    backgroundColor: color.blackbg,
    borderRadius: 10,
    padding: 16,
  },
  noReplyContainer: {
    width: '100%',
    backgroundColor: color.blackbg,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  noReplyText: {
    color: color.text,
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default MedicalComplaintReplyScreen;
