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
import NuevaImg from '@assets/images/IntroApp/Nueva.png';
import ArrowRight from '@assets/images/IntroApp/arrowRight.png';
import ArrowLeft from '@assets/images/IntroApp/arrowLeft.png';
import {color} from 'theme';
import Vector from '@assets/images/IntroApp/Vector.png';
import Ellipse from '@assets/images/IntroApp/Ellipse.png';

export const ThirdPage = ({num, setNum, handleIntialRouteName}) => {
  const point = [1, 2, 3, 4, 5];

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.image}
        imageStyle={styles.image}
        source={NuevaImg}>
        <Text style={styles.text}>
          El 2 de agosto de 2019, la UD Almería entró en una nueva etapa cuando
          el empresario saudí y Ministro de la Saudi Entertainment Authority
          (Turk Al-Sheikh), adquirió las acciones de la UD Almería. Las
          expectativas aumentaron a nivel deportivo, debido a la visión y
          ambición del propietario del club de competir con los clubes más
          grandes de Europa, y el equipo ascendió a primera división después de
          tres años de la adquisición. El dueño del club también tiene como
          objetivo explorar y desarrollar jugadores jóvenes para luego venderlos
          a muchos clubes , El club pudo vender jugadores por un total de 75
          millones de euros, que es el valor de venta más alto en la historia de
          un club en el Segunda división española.
        </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'left',
    marginHorizontal: 30,
    marginLeft: 50,
    marginTop: '70%',
    color: color.text,
    fontSize: 14,
    fontWeight: '400',
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
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {flexDirection: 'row', marginTop: 25, alignItems: 'center'},
  skip: {
    alignSelf: 'center',
    textAlign: 'center',
    color: '##F7F6F6D1',
    position: 'absolute',
    bottom: '5%',
  },
});
