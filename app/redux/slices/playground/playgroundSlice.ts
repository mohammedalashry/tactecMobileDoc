import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import type {RootState} from '../../store';

// Define a type for the slice state
interface Playground {
  backgroundImg: {imageCategory: string; imageId: number} | null;
}

// Define the initial state using that type
const initialState: Playground = {
  backgroundImg: null,
};

export const selectedPlaygroundImg = createSlice({
  name: 'selectedPlaygroundImg',
  initialState,
  reducers: {
    setSelectedBackgroundImg: (state, action: PayloadAction<any>) => {
      state.backgroundImg = action.payload;
    },
  },
});

export const {setSelectedBackgroundImg} = selectedPlaygroundImg.actions;

// Other code such as selectors can use the imported `RootState` type
export const tool = (state: RootState) => state.playground.backgroundImg;

export default selectedPlaygroundImg.reducer;
