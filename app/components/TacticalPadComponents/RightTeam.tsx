import React from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {color} from 'theme';
import {useQuery} from 'react-query';
import {axiosInterceptor} from 'utils/axios-utils';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useDispatch} from 'react-redux';
import {setTeam} from 'redux/slices/matches/MatchSlice';

export const RightTeam = ({
  setShowDefault,
  setAlerText1,
  setAlerText2,
  almeriaId,
  setAlert,
}) => {
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.login.accessToken);
  const fetchWellnessCheck = () => {
    return axiosInterceptor({
      url: `/v1/teams/?pageNo=1&pageSize=30`,
      method: 'GET',
      token,
    });
  };
  const {isLoading, data} = useQuery('teams', fetchWellnessCheck);
  const teams = data?.data?.records;
  const homeTeam: any = useSelector(
    (state: RootState) => state.matches.homeTeam,
  );
  return (
    <View style={[styles.container]}>
      {isLoading ? (
        <ActivityIndicator color={'#fff'} />
      ) : (
        <FlatList
          data={teams}
          keyExtractor={team => team._id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                if (homeTeam?._id === item._id) {
                  setAlerText1('Please select different team');
                  setAlerText2('You have to select two different teams');
                  setAlert(true);
                } else if (
                  homeTeam &&
                  homeTeam._id !== almeriaId &&
                  item._id !== almeriaId
                ) {
                  setAlerText1('Please select your team');
                  setAlerText2(
                    'You have selected the opposing team and have to select your team',
                  );
                  setAlert(true);
                } else {
                  dispatch(setTeam(item));
                  setShowDefault('draw');
                }
              }}>
              <View style={styles.card}>
                <Image style={styles.image} source={{uri: item?.icon}} />
                <Text style={styles.text}>{item?.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '85%',
    height: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    marginHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: color.blackbg,
    borderColor: color.line,
    borderWidth: 1,
    borderRadius: 20,
  },
  card: {
    flexDirection: 'row',
    height: 40,
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    // marginVertical: 5,
    backgroundColor: color.background,
    borderRadius: 25,
  },
  image: {
    width: 30,
    height: 35,
    resizeMode: 'contain',
  },
  text: {
    color: color.text,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 21,
  },
});
