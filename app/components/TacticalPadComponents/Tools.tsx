import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import {TacticalTools} from 'data/data';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {color} from 'theme/color';

const Tools = ({onAddShape, toggleEraseMode, isEraseMode}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleEraseMode}
        style={[styles.deleteButton, isEraseMode && styles.selectedTool]}>
        <Icon name="delete" size={15} color="white" />
        <Text style={styles.toolText}>Delete</Text>
      </TouchableOpacity>
      <ScrollView
        style={{backgroundColor: color.black, width: '100%', flex: 1}}>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {TacticalTools.map(tool => (
            <TouchableOpacity
              key={tool.id}
              style={styles.toolButton}
              onPress={() => onAddShape(tool.id)}>
              <Image source={tool.image} style={styles.toolImage} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  },
  toolButton: {
    alignItems: 'center',
    padding: 5,
    margin: '2.5%',
    borderRadius: 5,
    backgroundColor: color.blackbg,
    width: '45%',
  },
  toolImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: color.black,
    paddingVertical: 10,
    justifyContent: 'center',
    paddingHorizontal: 5,
    alignItems: 'center',
    marginBottom: 8,
    borderColor: color.border,
    borderWidth: 1,
    borderRadius: 5,
    width: '80%',
  },

  toolText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  selectedTool: {
    borderColor: color.blue,
    borderWidth: 2,
  },
});

export default Tools;
