import React from 'react';
import {
  SafeAreaView,
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import ArtboardImg from '@assets/images/IntroApp/Artboard.png';
import ArrowRight from '@assets/images/IntroApp/arrowRight.png';
import ArrowLeft from '@assets/images/IntroApp/arrowLeft.png';
import {color} from 'theme';
import Vector from '@assets/images/IntroApp/Vector.png';
import Ellipse from '@assets/images/IntroApp/Ellipse.png';

export const ForthPage = ({num, setNum, handleIntialRouteName}) => {
  const point = [1, 2, 3, 4, 5];

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.image}
        imageStyle={styles.image}
        source={ArtboardImg}>
        <View style={styles.points}>
          {point.map((item, index) => (
            <View key={index}>
              {item === num ? (
                <Image style={{marginHorizontal: 5}} source={Vector} />
              ) : (
                <Image style={{marginHorizontal: 5}} source={Ellipse} />
              )}
            </View>
          ))}
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => setNum(num - 1)}>
            <View style={styles.button}>
              <Image style={{tintColor: color.text}} source={ArrowLeft} />
              <Text style={styles.buttonText}>Back</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setNum(num + 1)}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Next</Text>
              <Image style={{tintColor: color.text}} source={ArrowRight} />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.skip}
          onPress={() => handleIntialRouteName()}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  buttonText: {
    color: color.text,
    fontSize: 14,
    fontWeight: '400',
    marginHorizontal: 5,
  },
  buttons: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginTop: 20,
    position: 'absolute',
    bottom: '8%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    flexDirection: 'row',
    marginTop: 25,
    alignItems: 'center',
    position: 'absolute',
    bottom: '15%',
    alignSelf: 'center',
  },
  skip: {
    alignSelf: 'center',
    textAlign: 'center',
    color: '##F7F6F6D1',
    position: 'absolute',
    bottom: '5%',
  },
});
