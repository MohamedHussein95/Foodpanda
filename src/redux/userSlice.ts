import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface userState {
  user: object;
  isAuthenticated: boolean;
}

const initialState: userState = {
  user: {},
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<object>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      AsyncStorage.setItem("userId", JSON.stringify(action.payload?.uid));
    },
    logOut: (state) => {
      return initialState;
    },
  },
});

export const { setUser, logOut } = userSlice.actions;

export default userSlice.reducer;
