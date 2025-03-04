// screens/common/LanguageSettings.tsx
import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {DetailScreen} from '../../components/shared/layout/DetailScreen';
import {LanguageSelector} from '../../components/shared/language/LanguageSelector';
import {Alert} from '../../components/shared/alerts/Alert';
import {LANGUAGES} from '../../services/language/languageService';
import {color, margin, padding, typography} from 'theme';
import I18n from 'i18n-js';
import {useLanguage} from 'hooks/language/useLanguage';

interface LanguageSettingsProps {
  navigation: any;
}

const LanguageSettings: React.FC<LanguageSettingsProps> = ({navigation}) => {
  const {currentLanguage} = useLanguage();
  const [restartAlertVisible, setRestartAlertVisible] = useState(false);

  const handleLanguageChange = (language: string) => {
    // Check if we're changing between RTL and LTR languages
    const currentIsRTL = currentLanguage === LANGUAGES.ARABIC;
    const newIsRTL = language === LANGUAGES.ARABIC;

    if (currentIsRTL !== newIsRTL) {
      // If switching between RTL and LTR, show restart message
      setRestartAlertVisible(true);
    }
  };

  return (
    <DetailScreen title={I18n.t('settings.language')}>
      <View style={styles.container}>
        <Text style={styles.description}>
          {I18n.t('settings.languageDescription')}
        </Text>

        <LanguageSelector onLanguageChange={handleLanguageChange} />

        <Alert
          isVisible={restartAlertVisible}
          title={I18n.t('settings.restartRequired')}
          message={I18n.t('settings.restartRequiredDescription')}
          primaryButtonText={I18n.t('common.ok')}
          onPrimaryAction={() => setRestartAlertVisible(false)}
          onDismiss={() => setRestartAlertVisible(false)}
          type="warning"
        />
      </View>
    </DetailScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  description: {
    fontSize: 14,
    fontFamily: typography.primary,
    color: color.text,
    textAlign: 'center',
    marginVertical: margin.large,
    paddingHorizontal: padding.large,
  },
});

export default LanguageSettings;
