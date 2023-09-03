import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userState {
  user: object;
  token: string;
  isAuthenticated: boolean;
}

const initialState: userState = {
  user: {},
  token: "",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<object>) => {
      state.user = action.payload.user;
      if (action.payload.token) {
        state.token = action.payload.token;
      }
    },
    authenticateUser: (state) => {
      state.isAuthenticated = true;
    },

    logOut: () => {
      console.log("logging out...");
      return initialState;
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
});

export const { setUser, logOut, authenticateUser, updateAccessToken } =
  userSlice.actions;

export default userSlice.reducer;
