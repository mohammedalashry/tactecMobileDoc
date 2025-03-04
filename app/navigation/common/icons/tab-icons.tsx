// common/icons/tab-icons.tsx (updated with additional icons)
import React from 'react';
import {View, StyleSheet} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';

type IconProps = {
  color: string;
  size?: number;
  focused?: boolean;
};

export const TabIcons = {
  // Common icons already implemented
  home: ({color, size = 25}: IconProps) => (
    <AntDesign name="home" color={color} size={size} />
  ),

  notification: ({color, size = 25}: IconProps) => (
    <Ionicons name="notifications-outline" color={color} size={size} />
  ),

  menu: ({color, size = 25}: IconProps) => (
    <Ionicons name="md-menu-outline" color={color} size={size} />
  ),

  players: ({color, size = 25}: IconProps) => (
    <MaterialCommunityIcons name="account-group" color={color} size={size} />
  ),

  // New and updated icons
  matches: ({color, size = 25}: IconProps) => (
    <FontAwesome5 name="futbol" color={color} size={size} />
  ),

  training: ({color, size = 25}: IconProps) => (
    <MaterialCommunityIcons name="whistle" color={color} size={size} />
  ),

  tasks: ({color, size = 25}: IconProps) => (
    <MaterialCommunityIcons
      name="clipboard-text-outline"
      color={color}
      size={size}
    />
  ),

  complaints: ({color, size = 25}: IconProps) => (
    <MaterialCommunityIcons
      name="comment-alert-outline"
      color={color}
      size={size}
    />
  ),

  medicalComplaints: ({color, size = 25}: IconProps) => (
    <MaterialCommunityIcons name="medical-bag" color={color} size={size} />
  ),

  calendar: ({color, size = 25}: IconProps) => (
    <AntDesign name="calendar" color={color} size={size} />
  ),

  wellness: ({color, size = 25}: IconProps) => (
    <FontAwesome5 name="heartbeat" color={color} size={size} />
  ),

  medicalScreen: ({color, size = 25}: IconProps) => (
    <FontAwesome5 name="hospital" color={color} size={size} />
  ),

  tacticalScreen: ({color, size = 25}: IconProps) => (
    <FontAwesome5 name="chalkboard-teacher" color={color} size={size} />
  ),

  received: ({color, size = 25}: IconProps) => (
    <Feather name="inbox" color={color} size={size} />
  ),

  sent: ({color, size = 25}: IconProps) => (
    <Feather name="send" color={color} size={size} />
  ),

  reports: ({color, size = 25}: IconProps) => (
    <Ionicons name="document-text-outline" color={color} size={size} />
  ),

  profile: ({color, size = 25}: IconProps) => (
    <AntDesign name="user" color={color} size={size} />
  ),

  attendance: ({color, size = 25}: IconProps) => (
    <MaterialCommunityIcons
      name="account-check-outline"
      color={color}
      size={size}
    />
  ),

  medical: ({color, size = 25}: IconProps) => (
    <FontAwesome5 name="heartbeat" color={color} size={size} />
  ),

  checkIn: ({color, size = 25}: IconProps) => (
    <AntDesign name="qrcode" color={color} size={size} />
  ),

  // Special centered tab icons with circle background
  tacticalCenter: ({color, focused = false}: IconProps) => (
    <View style={[styles.centerIconContainer, {borderColor: color}]}>
      <MaterialCommunityIcons
        name="soccer-field"
        color={focused ? color : '#aaa'}
        size={25}
      />
    </View>
  ),

  medicalCenter: ({color, focused = false}: IconProps) => (
    <View style={[styles.centerIconContainer, {borderColor: color}]}>
      <FontAwesome5 name="plus" color={focused ? color : '#aaa'} size={25} />
    </View>
  ),

  playerCenter: ({color, focused = false}: IconProps) => (
    <View style={[styles.centerIconContainer, {borderColor: color}]}>
      <MaterialCommunityIcons
        name="account"
        color={focused ? color : '#aaa'}
        size={25}
      />
    </View>
  ),
};

const styles = StyleSheet.create({
  centerIconContainer: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#000',
    borderWidth: 1,
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
