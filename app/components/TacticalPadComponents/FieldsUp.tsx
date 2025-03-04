import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {FieldsUp} from 'data/data';
import {color} from 'theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch} from 'react-redux';
import {setSelectedBackgroundImg} from 'redux/slices/playground/playgroundSlice';

export const FieldUp = ({setFieldStyle, setPostProject}) => {
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={() => setFieldStyle(false)}>
        <AntDesign name="close" size={20} color={color.text} />
      </TouchableOpacity> */}

      <FlatList
        data={FieldsUp}
        
        numColumns={3}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              dispatch(
                setSelectedBackgroundImg({
                  imageCategory: 'filedsUp',
                  imageId: item.id - 1,
                }),
              );
              setFieldStyle(false);
              setPostProject(true);
            }}
          >
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
    // position: 'relative',
    alignSelf: 'center',
    alignItems: 'center',
  },
  img: {
    width: 130,
    height: 95,
    resizeMode: 'contain',
    marginHorizontal: 5,
    marginVertical: 5,
  },
});
