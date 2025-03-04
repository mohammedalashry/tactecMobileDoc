import React from 'react';
import {View, Modal, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {color} from '@theme/color';
export const CustomAlert = ({
  isShow,
  text = '',
  text2 = '',
  text3 = '',
  confirm,
  cancel,
  Cancel,
  Confirm,
}) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShow}
        supportedOrientations={['landscape']}
        onRequestClose={() => {}}>
        <View style={styles.centeredView}>
          <View style={styles.modal}>
            <View>
              <Text style={[styles.modalText, {color: color.primary}]}>
                {text}
              </Text>
              <Text style={styles.modalText}>{text2}</Text>
            </View>
            <View style={styles.modalButton}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => confirm()}>
                <Text style={styles.modalButtonCloseText}>{Confirm}</Text>
              </TouchableOpacity>
              {Cancel ? (
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => cancel()}>
                  <Text style={styles.modalButtonCloseText}>{Cancel}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    top: '20%',
    justifyContent: 'center',
    marginTop: 22,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: color.background,
    borderColor: color.line,
    borderWidth: 1,
    zIndex: 1,
  },
  modal: {
    backgroundColor: color.background,
    width: '48%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderColor: color.line,
    borderWidth: 1,
    paddingTop: 12,
    paddingBottom: 25,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalText: {
    fontSize: 14,
    color: color.text,
    textAlign: 'center',
    //  //fontFamily: 'Cairo-Medium',,
  },
  modalButton: {
    width: '90%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 25,
    alignItems: 'center',
  },
  modalCloseButton: {
    width: 100,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelButton: {
    width: 100,
    height: 40,
    borderRadius: 20,
    borderColor: color.line,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonCloseText: {
    fontSize: 12,
    color: color.text,
    //  //fontFamily: 'Cairo-Medium',,
    textAlign: 'center',
  },
});
