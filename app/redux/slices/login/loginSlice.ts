import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { save, remove } from "utils/storage/index";

import type { RootState } from "../../store";

// Define a type for the slice state
interface userData {
  accessToken: string | null;
  userData: {
    email: string;
    name: string;
    role: string;
    status: string;
    _id: string;
    profileImage: string;
    dataEntry?: boolean;
  } | null;
}

// Define the initial state using that type
const initialState: userData = {
  accessToken: "",
  userData: {
    email: "",
    name: "",
    role: "",
    status: "",
    _id: "",
    profileImage: "",
  },
};

export const userData = createSlice({
  name: "setUserData",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<any>) => {
      save("userData", action.payload);
      state.accessToken = action.payload.accessToken;
      state.userData = action.payload.userData;
    },
    userLogout: (state) => {
      remove("userData");
      remove("fcmToken");
      state.accessToken = null;
      state.userData = null;
    },
  },
});

export const { setUserData, userLogout } = userData.actions;

// Other code such as selectors can use the imported `RootState` type
export const user = (state: RootState) => state.login.userData;

export default userData.reducer;
