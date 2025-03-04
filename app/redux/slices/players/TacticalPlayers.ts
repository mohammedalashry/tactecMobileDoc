import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Player {
  _id: number;
  name: string;
  shirtNumber: number;
  team: string;
  color: string;
  primary: boolean;
  position: string;
}

interface PlayersState {
  players: Player[];
  selectedPlayers: Player[];
  playersOnField: Player[];
}

const initialState: PlayersState = {
  players: [],
  selectedPlayers: [],
  playersOnField: [],
};

const tacticalPlayersSlice = createSlice({
  name: 'tacticalPlayers',
  initialState,
  reducers: {
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      let color = '';
      action?.payload?.map(p => {
        switch (p.position) {
          case 'GK':
            color = '#FF8C20';
            break;
          case 'CB':
            color = '#5488FF';
            break;
          case 'CM':
            color = '#008000';
            break;
          case 'ST':
            color = '#FF0000';
            break;
          default:
            color = '#FFFFFF';
            break;
        }
      });
      state.players = action?.payload?.map(p => ({
        ...p,
        color: color,
      }));
    },
    addSelectedPlayer: (state, action: PayloadAction<Player>) => {
      state.selectedPlayers.push(action.payload);
    },
    removeSelectedPlayer: (state, action: PayloadAction<Player>) => {
      state.selectedPlayers = state.selectedPlayers.filter(
        p => p._id !== action.payload._id,
      );
    },
  },
});

export const {setPlayers, addSelectedPlayer, removeSelectedPlayer} =
  tacticalPlayersSlice.actions;

export default tacticalPlayersSlice.reducer;
