import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {color} from 'theme/color';

import {Field} from './Fields';
import {FieldUp} from './FieldsUp';
import {FieldDown} from './FieldsDown';
import SoccerField2 from '@assets/images/tactec/SoccerField2.png';
import SoccerFieldUp from '@assets/images/tactec/SoccerFieldUp.png';
import SoccerFieldDwon from '@assets/images/tactec/SoccerFieldDwon.png';
const FieldSection = ({
  showFieldType,
  setShowFieldType,
  setIsShowField,
  setPostProject,
}) => {
  return (
    <>
      <View style={{width: '100%', height: '75%'}}>
        {showFieldType === 'normal' && (
          <Field
            setFieldStyle={setIsShowField}
            setPostProject={setPostProject}
          />
        )}
        {showFieldType === 'up' && (
          <FieldUp
            setFieldStyle={setIsShowField}
            setPostProject={setPostProject}
          />
        )}
        {showFieldType === 'down' && (
          <FieldDown
            setFieldStyle={setIsShowField}
            setPostProject={setPostProject}
          />
        )}
      </View>
      <View style={[styles.fieldsCard, {alignSelf: 'center'}]}>
        <TouchableOpacity onPress={() => setShowFieldType('normal')}>
          <Image
            source={SoccerField2}
            style={{
              borderColor:
                showFieldType === 'normal' ? color.primary : color.line,
              borderWidth: 1,
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowFieldType('up')}>
          <Image
            source={SoccerFieldUp}
            style={{
              borderColor: showFieldType === 'up' ? color.primary : color.line,
              borderWidth: 1,
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowFieldType('down')}>
          <Image
            source={SoccerFieldDwon}
            style={{
              borderColor:
                showFieldType === 'down' ? color.primary : color.line,
              borderWidth: 1,
            }}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  fieldsCard: {
    flexDirection: 'row',
    width: '100%',
    height: '20%',
    backgroundColor: color.cardbg,
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
});
export default FieldSection;
