import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import I18n from 'i18n-js';
import {Dimensions} from 'react-native';

import type {RootState} from '../../store';

// Define a type for the slice state
export interface GeneralState {
  currentLang?: string;
  isRTL: boolean;
  gender: string;
  deviceWidth: number;
  deviceHeight: number;
}

const {width, height} = Dimensions.get('window');

// Define the initial state using that type

const initialState: GeneralState = {
  currentLang: 'en',
  isRTL: I18n.currentLocale() === 'ar',
  gender: '',
  deviceWidth: width,
  deviceHeight: height,
};

export const language = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    setLang: (state, action: PayloadAction<any>) => {
      state.currentLang = action.payload;
    },
  },
});

export const {setLang} = language.actions;

// Other code such as selectors can use the imported `RootState` type
export const tool = (state: RootState) => state.lang;

export default language.reducer;
