import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import type {RootState} from '../../store';

// Define a type for the slice state
interface Match {
  team: {};
  homeTeam: {};

  almeriaFormation: {
    id: number;
    text: string;
  };
  opposingFormation: {
    id: number;
    text: string;
  };

  matchImgs: [];
}

// Define the initial state using that type
const initialState: Match = {
  team: {},
  homeTeam: {},

  almeriaFormation: {
    id: 0,
    text: '-',
  },
  opposingFormation: {
    id: 0,
    text: '-',
  },
  matchImgs: [],
};

export const matches = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    setTeam: (state, action: PayloadAction<any>) => {
      state.team = action.payload;
    },
    sethomeTeam: (state, action: PayloadAction<any>) => {
      state.homeTeam = action.payload;
    },

    setAlmeriaFormation: (state, action: PayloadAction<any>) => {
      state.almeriaFormation = action.payload;
    },
    setOpposingFormation: (state, action: PayloadAction<any>) => {
      state.opposingFormation = action.payload;
    },
    setMatchImg: (state, action: PayloadAction<any>) => {
      state.matchImgs = action.payload;
    },
  },
});

export const {
  setTeam,
  sethomeTeam,
  setAlmeriaFormation,
  setOpposingFormation,
  setMatchImg,
} = matches.actions;

// Other code such as selectors can use the imported `RootState` type
export const tool = (state: RootState) => state.matches.team;

export default matches.reducer;
