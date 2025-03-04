import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {color} from 'theme';
import {DetailScreen} from 'components/shared/layout/DetailScreen';
import {Avatar} from 'components/shared/media/Avatar';
import {Alert} from 'components/shared/alerts/Alert';
import {MedicalComplaintDialog} from 'components/shared/dialogs/MedicalComplaintDialog';
import {useMedicalComplaintsList} from 'hooks/medical/useMedicalComplaintsList';
import I18n from 'i18n-js';
import {MedicalComplaint} from 'services/api/medicalComplaintService';
import {formatAMPM} from 'utils/dates/date';
import moment from 'moment';

const MedicalComplaintsScreen = ({navigation}) => {
  const {
    complaints,
    isLoading,
    error,
    selectedComplaintId,
    setSelectedComplaintId,
    showSendDialog,
    setShowSendDialog,
    isShowConfirmation,
    setIsShowConfirmation,
    newComplaintText,
    setNewComplaintText,
    fetchComplaints,
    sendComplaint,
  } = useMedicalComplaintsList();

  const handleViewComplaint = (complaintId: string) => {
    setSelectedComplaintId(complaintId);
    navigation.navigate('MedicalComplaintsReply', {_id: complaintId});
  };

  const renderComplaintItem = ({item}: {item: MedicalComplaint}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleViewComplaint(item._id)}>
      <View style={styles.headerCard}>
        <Avatar uri={item.player?.profileImage} size={35} borderWidth={0} />
        <Text style={styles.name}>{item.player?.name}</Text>
      </View>

      <Text numberOfLines={3} style={styles.content}>
        {item.description}
      </Text>

      <View style={styles.dateView}>
        <View style={styles.dateGroup}>
          <Text style={styles.timeText}>
            {moment(item.createdAt).format('DD, ')}
          </Text>
          <Text style={[styles.timeText, {color: color.text}]}>
            {moment(item.createdAt).format('MMM')}
          </Text>
        </View>
        <Text style={styles.timeText}>
          {formatAMPM(new Date(item.createdAt))}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <DetailScreen
      title={I18n.t('tabs.MedicalComplaints')}
      loading={isLoading}
      showBackButton={false}>
      <View style={styles.container}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchComplaints}>
              <Text style={styles.retryText}>{I18n.t('common.retry')}</Text>
            </TouchableOpacity>
          </View>
        ) : complaints.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {I18n.t('medical.noComplaints')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={complaints}
            keyExtractor={item => item._id}
            renderItem={renderComplaintItem}
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* Add Complaint Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowSendDialog(true)}>
          <Image
            style={styles.addIcon}
            source={require('@assets/images/Player/Plus.png')}
          />
          <Text style={styles.addText}>{I18n.t('medical.addComplaint')}</Text>
        </TouchableOpacity>

        {/* Send Complaint Dialog */}
        <MedicalComplaintDialog
          isVisible={showSendDialog}
          onDismiss={() => setShowSendDialog(false)}
          onSubmit={sendComplaint}
          complaintText={newComplaintText}
          onComplaintTextChange={setNewComplaintText}
        />

        {/* Confirmation Dialog */}
        <Alert
          isVisible={isShowConfirmation}
          title={I18n.t('medical.complaintSent')}
          message={I18n.t('medical.complaintSentMessage')}
          primaryButtonText={I18n.t('common.ok')}
          onPrimaryAction={() => setIsShowConfirmation(false)}
          onDismiss={() => setIsShowConfirmation(false)}
          type="success"
        />
      </View>
    </DetailScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
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
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: color.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: color.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: color.text,
    fontSize: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
  card: {
    width: '95%',
    backgroundColor: color.blackbg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: color.black,
    marginHorizontal: 10,
    marginVertical: 8,
    padding: 15,
    elevation: 2,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    color: color.text,
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    color: color.text,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  dateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateGroup: {
    flexDirection: 'row',
  },
  timeText: {
    fontSize: 12,
    color: color.primary,
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: color.blackbg,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: color.line,
    elevation: 4,
  },
  addIcon: {
    width: 16,
    height: 16,
    tintColor: color.primary,
    marginRight: 8,
  },
  addText: {
    color: color.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MedicalComplaintsScreen;
