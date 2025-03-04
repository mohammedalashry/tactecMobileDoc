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
import HistoriaImg from '@assets/images/IntroApp/Historia.png';
import ArrowRight from '@assets/images/IntroApp/arrowRight.png';
import ArrowLeft from '@assets/images/IntroApp/arrowLeft.png';
import {color} from 'theme';
import Vector from '@assets/images/IntroApp/Vector.png';
import Ellipse from '@assets/images/IntroApp/Ellipse.png';

export const SecondPage = ({num, setNum, handleIntialRouteName}) => {
  const point = [1, 2, 3, 4, 5];
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.image}
        imageStyle={styles.image}
        source={HistoriaImg}>
        <Text style={styles.text}>
          En 1909 se fundó el primer club de fútbol de Almería: el Almería
          Foot-Ball Club.[5] Desde entonces, aparecieron y desaparecieron varios
          clubes de fútbol del Almería. Uno de ellos fue la AD Almería, un
          equipo que jugó en La Liga entre 1979 y 1981, pero desapareció en
          1982, y posiblemente fue el predecesor de la UD Almería. En 1989 nació
          un club llamado Almería Club de Fútbol, pero en 2001 pasó a llamarse
          Unión. Deportiva Almería. El 19 de enero de 2001 el alcalde de Almería
          Santiago Martínez Cabrejas anunció en el ayuntamiento que el nuevo
          club UD Almería se había formado tras la fusión de dos equipos de la
          ciudad - Polideportivo Almería y Almería CF.[6] Pero la UD Almería no
          fue oficial hasta el 28 de junio de 2001, cuando el Almería CF aprobó
          en Junta General de Accionistas el cambio de denominación.[6] Tras
          jugar una temporada en Segunda División, descendió a Tercera y Cuarta
          División. Tras pasar varias temporadas en Segunda, el Almería ascendió
          por primera vez a la máxima categoría tras quedar subcampeón en la
          temporada 2006-07.
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
    marginTop: '35%',
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
