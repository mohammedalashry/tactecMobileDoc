import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  View,
} from 'react-native';
import {color} from 'theme/color';
import PostImg from '@assets/images/tactec/Vector1.png';
import AddImg from '@assets/images/tactec/add.png';
import DeleteImg from '@assets/images/tactec/trash.png';
import FieldImg from '@assets/images/tactec/tabler_soccer.png';
import PlayersImg from '@assets/images/tactec/emoji_contrast.png';
import ToolsImg from '@assets/images/tactec/road_cone.png';
import ExitImg from '@assets/images/tactec/exit.png';
import {translate} from '@app/i18n';
const ToolBar = ({
  onPublish,
  onSaveFrame,
  onDeleteFrame,
  onFieldButton,
  onPlayersButton,
  onToolsButton,
  onExit,
  isShowTacticalTools,
  isShowPlayers,
  isDeleteFrame,
  isShowField,
  isShowDrawTools,
}) => {
  return (
    <ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onPublish}>
          <Image source={PostImg} style={styles.image} />
          <Text style={styles.text}>
            {translate('TectacBoard.PostProject')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onSaveFrame}>
          <Image source={AddImg} style={styles.image} />
          <Text style={styles.text}>{translate('TectacBoard.AddFrame')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isDeleteFrame && styles.selectedBorder]}
          onPress={onDeleteFrame}>
          <Image source={DeleteImg} style={styles.image} />
          <Text style={styles.text}>
            {translate('TectacBoard.DeleteFrame')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isShowField && styles.selectedBorder]}
          onPress={onFieldButton}>
          <Image source={FieldImg} style={styles.image} />
          <Text style={styles.text}>{translate('TectacBoard.FieldStyle')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isShowPlayers && styles.selectedBorder]}
          onPress={onPlayersButton}>
          <Image source={PlayersImg} style={styles.image} />
          <Text style={styles.text}>{translate('TectacBoard.Players')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isShowTacticalTools && styles.selectedBorder]}
          onPress={onToolsButton}>
          <Image source={ToolsImg} style={styles.image} />
          <Text style={styles.text}>{translate('TectacBoard.Tools')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onExit}>
          <Image source={ExitImg} style={styles.image} />
          <Text style={styles.text}>{translate('TectacBoard.Exit')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    width: '100%',
    height: '85%',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  button: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 3,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: color.black,
    borderColor: color.border,
    borderWidth: 1,
  },
  text: {
    width: '100%',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 5,
    color: color.text,
  },
  selectedBorder: {
    borderColor: color.primary,
  },
  image: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

export default ToolBar;
