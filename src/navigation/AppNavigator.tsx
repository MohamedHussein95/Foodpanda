import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import MainNavigator from "./MainNavigator";
import AuthNavigator from "./AuthNavigator";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { Colors } from "../constants";
import { setTheme } from "../redux/SettingsSlice";

const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.primary500,
    background: Colors.dark1,
    grey: Colors.greyScale800,
    lightGrey: Colors.greyScale900,
    mediumGrey: Colors.greyScale700,
    darkGrey: Colors.greyScale500,
    transBg: Colors.darkBg,
  },
};
const defaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary500,
    text: Colors.dark2,
    background: Colors.white,
    grey: Colors.greyScale200,
    lightGrey: Colors.greyScale100,
    mediumGrey: Colors.disabled,
    darkGrey: Colors.greyScale600,
    transBg: Colors.lightBg,
  },
};

const AppNavigator = ({ onReady }: { onReady: () => Promise<void> }) => {
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const theme = useColorScheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setTheme(theme === "dark"));
  }, [theme]);
  return (
    <NavigationContainer onReady={onReady}>
      <ThemeProvider value={!isDarkMode ? darkTheme : defaultTheme}>
        <AuthNavigator />
      </ThemeProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;
