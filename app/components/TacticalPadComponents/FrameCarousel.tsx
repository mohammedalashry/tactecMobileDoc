import React from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {color} from 'theme/color';

const FrameCarousel = ({frames, onDeleteFrame, isDeleteFrame}) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {frames.map((frame, index) => (
          <View key={index} style={styles.frameContainer}>
            <TouchableOpacity onPress={() => {}}>
              <Image source={{uri: frame}} style={styles.frameImage} />
            </TouchableOpacity>
            {isDeleteFrame && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDeleteFrame(index)}>
                <Icon name="close" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: '2.5%',
    height: '15%',
    backgroundColor: color.black,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  frameContainer: {
    marginHorizontal: 5,
    position: 'relative',
    backgroundColor: color.background,
  },
  frameImage: {
    width: 80,
    height: '100%',
    borderRadius: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 2,
  },
});

export default FrameCarousel;
