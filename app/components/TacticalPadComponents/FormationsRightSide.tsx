import React from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {color} from 'theme';
import {FormationsRightSide} from 'data/data';
import {useDispatch, useSelector} from 'react-redux';
import {
  setOpposingFormation,
  setAlmeriaFormation,
} from 'redux/slices/matches/MatchSlice';
import {RootState} from 'redux/store';

export const FormationRightSide = ({
  setShowDefault,
  setAlerText1,
  setAlerText2,
  almeriaId,
  setAlert,
}) => {
  const dispatch = useDispatch();
  const awayTeam: any = useSelector((state: RootState) => state.matches.team);

  return (
    <View style={[styles.container]}>
      <FlatList
        style={{width: '100%'}}
        data={FormationsRightSide}
        numColumns={2}
        renderItem={({item, index}) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (!awayTeam) {
                setAlerText1('Please select the team');
                setAlerText2(
                  'You have to select the team first before selecting the formation',
                );
                setAlert(true);
              } else if (awayTeam._id === almeriaId) {
                dispatch(setAlmeriaFormation(item));
                setShowDefault('draw');
              } else {
                dispatch(setOpposingFormation(item));
                setShowDefault('draw');
              }
            }}>
            <View style={styles.card}>
              <Image style={styles.image} source={item.image} />
              <Text style={styles.text}>{item?.text}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    marginHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: color.blackbg,
    zIndex: 11,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    width: '90%',
    marginHorizontal: 5,
  },
  image: {
    width: 65,
    height: 50,
    resizeMode: 'contain',
  },
  text: {
    color: color.text,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 21,
  },
});
