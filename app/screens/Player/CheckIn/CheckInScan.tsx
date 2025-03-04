import React from "react";
import {View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground} from 'react-native';
import { color } from "theme";
import TakenScanQR from '@assets/images/Player/TakenScanQR.png';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ScreenShots  from '@assets/images/Screenshot1.png';
import I18n from "i18n-js";

const CheckInSCan = ({navigation}) =>{
    return(
        <View style={styles.container}>
            <View style={[styles.header]}>
                <Image source={ScreenShots}/>
                <View style={styles.headerCard}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                            <MaterialIcons name = "keyboard-arrow-left" size={20} color={color.text}/>
                            <Text style={styles.back}>{I18n.t("Player.Back")}</Text>
                        </View>
                    </TouchableOpacity>
                        <Text style={styles.text}>{I18n.t("Player.ScanQR")}</Text>
                    </View>
                </View>
            <View style={styles.backgroundView}>
            <TouchableOpacity onPress={() => navigation.navigate('ResultSCan')}>
            <ImageBackground style={styles.image} imageStyle={styles.image} source={TakenScanQR}>

            </ImageBackground>
            </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:color.background,
  
      },
      header:{
        backgroundColor:color.black,
        justifyContent:'center', 
        alignItems:'center', 
        height:160
    },
    headerCard:{
        flexDirection:'row',
        width:'90%',
        marginTop:20
      },
    text:{
        fontSize: 15,
        fontWeight:'700',
        color:color.text,
        alignSelf:'center',
        justifyContent:'center',
        marginLeft:60
    },
    back:{
        fontSize:14,
        color:color.text
    },
      backgroundView:{
        width:'90%',
        height:'70%',
        backgroundColor:color.primaryLight,
        alignItems:'center',
        justifyContent:'center',
        alignSelf:'center',
        marginTop:10
      },
      image:{
        width:330,
        height:330,
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center',
      },
});

export default CheckInSCan;