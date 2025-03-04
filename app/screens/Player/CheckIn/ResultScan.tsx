import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {color} from 'theme';
import {DetailScreen} from 'components/shared/layout/DetailScreen';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import I18n from 'i18n-js';
import {Avatar} from 'components/shared/media/Avatar';

const CheckInResultScreen = ({route, navigation}) => {
  const {result} = route.params || {result: {success: true}};

  // Get user data from Redux store
  const userData = useSelector((state: RootState) => state.login.userData);

  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  const handleScanAgain = () => {
    navigation.goBack();
  };

  return (
    <DetailScreen
      title={I18n.t('checkIn.result')}
      loading={false}
      showBackButton={true}>
      <View style={styles.container}>
        <View style={styles.resultContainer}>
          <View style={styles.iconContainer}>
            <Image
              source={
                result.success
                  ? require('@assets/images/Player/Plus.png')
                  : require('@assets/images/Player/Plus.png')
              }
              style={[
                styles.icon,
                {tintColor: result.success ? '#1CBC83' : '#dd3333'},
              ]}
            />
          </View>

          <Text style={styles.resultTitle}>
            {result.success
              ? I18n.t('checkIn.successful')
              : I18n.t('checkIn.failed')}
          </Text>

          <Text style={styles.resultMessage}>
            {result.message ||
              (result.success
                ? I18n.t('checkIn.successMessage')
                : I18n.t('checkIn.failMessage'))}
          </Text>
        </View>

        {result.success && (
          <View style={styles.playerInfoContainer}>
            <Avatar
              uri={userData?.profileImage}
              size={80}
              borderColor={color.primary}
              borderWidth={2}
            />

            <View style={styles.playerDetails}>
              <Text style={styles.playerName}>{userData?.name}</Text>

              {userData?.role && (
                <Text style={styles.playerRole}>
                  {userData.role.charAt(0).toUpperCase() +
                    userData.role.slice(1)}
                </Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleBackToHome}>
            <Text style={styles.buttonText}>
              {I18n.t('checkIn.backToHome')}
            </Text>
          </TouchableOpacity>

          {!result.success && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleScanAgain}>
              <Text style={styles.buttonText}>
                {I18n.t('checkIn.scanAgain')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </DetailScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  resultContainer: {
    backgroundColor: color.blackbg,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: color.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 48,
    height: 48,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: color.text,
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 16,
    color: color.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  playerInfoContainer: {
    backgroundColor: color.blackbg,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  playerDetails: {
    marginLeft: 16,
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.text,
    marginBottom: 4,
  },
  playerRole: {
    fontSize: 14,
    color: color.primary,
  },
  buttonsContainer: {
    width: '100%',
    marginTop: 'auto',
  },
  button: {
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: color.primary,
  },
  secondaryButton: {
    backgroundColor: color.blackbg,
    borderWidth: 1,
    borderColor: color.line,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.text,
  },
});

export default CheckInResultScreen;
