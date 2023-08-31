import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface settingsState {
  darkMode: boolean;
}

const initialState: settingsState = {
  darkMode: false,
};

const SettingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const { setTheme, toggleTheme } = SettingsSlice.actions;

export default SettingsSlice.reducer;
