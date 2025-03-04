import React from 'react';
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {FieldsDown} from 'data/data';
import {color} from 'theme/color';
import {setSelectedBackgroundImg} from 'redux/slices/playground/playgroundSlice';
import {useDispatch} from 'react-redux';

export const FieldDown = ({setFieldStyle, setPostProject}) => {
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <FlatList
        data={FieldsDown}
        numColumns={3}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              dispatch(
                setSelectedBackgroundImg({
                  imageCategory: 'filedsDown',
                  imageId: item.id - 1,
                }),
              );
              setFieldStyle(false);
              setPostProject(true);
            }}>
            <Image style={styles.img} source={item.image} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
    position: 'relative',
    alignSelf: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  img: {
    width: 130,
    height: 95,
    resizeMode: 'contain',
    marginHorizontal: 5,
    marginVertical: 5,
  },
});
