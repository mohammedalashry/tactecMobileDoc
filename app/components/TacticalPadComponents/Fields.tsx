import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Fields} from 'data/data';
import {color} from 'theme/color';
import {useDispatch} from 'react-redux';
import {setSelectedBackgroundImg} from 'redux/slices/playground/playgroundSlice';

export const Field = ({setFieldStyle, setPostProject}) => {
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <FlatList
        data={Fields}
        numColumns={3}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              dispatch(
                setSelectedBackgroundImg({
                  imageCategory: 'fileds',
                  imageId: item.id,
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
    backgroundColor: 'green',
    position: 'relative',
    alignItems: 'center',
  },
  img: {
    width: 130,
    height: 95,
    resizeMode: 'contain',
    marginHorizontal: 5,
  },
});
