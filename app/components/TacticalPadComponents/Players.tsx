import I18n from 'i18n-js';
import React, {useEffect} from 'react';
import {View, FlatList, Text, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {color} from 'theme';
import Icon from 'react-native-vector-icons/FontAwesome';

import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useDispatch} from 'react-redux';
import {
  addSelectedPlayer,
  removeSelectedPlayer,
  setPlayers,
} from 'redux/slices/players/TacticalPlayers';
import {useQuery} from 'react-query';
import {axiosInterceptor} from 'utils/axios-utils';

export const Players = ({handleSectionShow}) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.login.accessToken);

  const fetchPlayers = () => {
    return axiosInterceptor({
      url: `v1/users/?type=player&pageSize=50`,
      method: 'GET',
      token,
    });
  };
  const {isLoading, data} = useQuery('players', fetchPlayers);
  const playersData = data?.data?.records;

  useEffect(() => {
    dispatch(setPlayers(playersData));
  }, [isLoading]);
  const selectedPlayers =
    useSelector((state: RootState) => state.tacticalPlayers.selectedPlayers) ||
    {};

  const players = useSelector(
    (state: RootState) => state.tacticalPlayers.players,
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {I18n.t('TectacBoard.SelectPlayers')}
        </Text>

        <TouchableOpacity
          onPress={() => {
            handleSectionShow('draw');
          }}>
          <Text
            style={{
              color: '#fff',
              padding: 2,
            }}>
            X
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={{flex: 1, backgroundColor: color.black, width: '100%'}}
        data={players}
        renderItem={({item, index}: any) =>
          item?.shirtNumber && (
            <TouchableOpacity
              onPress={() => {
                selectedPlayers.map((p: any) => p._id).includes(item?._id)
                  ? dispatch(removeSelectedPlayer(item))
                  : dispatch(addSelectedPlayer(item));
              }}
              key={index}>
              <View style={styles.card}>
                <View style={styles.whiteCard}>
                  {selectedPlayers
                    .map((p: any) => p._id)
                    .includes(item?._id) ? (
                    <Icon name="check" size={10} color="#000" />
                  ) : null}
                </View>
                <Text style={[styles.type, {color: item?.color}]}>
                  {item?.position}
                </Text>
                <Text style={styles.num}>{item?.shirtNumber}</Text>
                <Text style={styles.name}>{item?.name}</Text>
              </View>
            </TouchableOpacity>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    marginTop: 15,
    backgroundColor: color.black,
  },
  header: {
    width: '100%',
    borderColor: color.line,
    borderWidth: 1,
    backgroundColor: color.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: color.text,
  },
  card: {
    flexDirection: 'row',
    width: '95%',
    backgroundColor: color.blackbg,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 2,
    alignSelf: 'center',
  },
  whiteCard: {
    width: '10%',
    height: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  type: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'left',
    width: '10%',
    marginRight: 5,
  },
  num: {
    fontSize: 10,
    color: color.primary,
    width: '15%',
    textAlign: 'left',
  },
  name: {
    fontSize: 12,
    color: color.text,
    fontWeight: '700',
    textAlign: 'left',
    width: '50%',
  },
});
