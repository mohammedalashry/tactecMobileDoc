import * as React from 'react';
import {ViewStyle, KeyboardAvoidingView, Platform} from 'react-native';
import {color} from 'theme';

const ROOT: ViewStyle = {backgroundColor: color.background, flex: 1};

export interface StoryScreenProps {
  children?: any;
}

const behavior = Platform.OS === 'ios' ? 'padding' : undefined;
export const StoryScreen = (props: StoryScreenProps) => (
  <KeyboardAvoidingView
    style={ROOT}
    behavior={behavior}
    keyboardVerticalOffset={50}>
    {props.children}
  </KeyboardAvoidingView>
);
