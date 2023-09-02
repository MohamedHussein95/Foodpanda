import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import {
  AccountSetUpScreen,
  ForgotPasswordScreen,
  HomeScreen,
  OnboardingScreen,
  SignInScreen,
  SignUpScreen,
} from "../screens";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const [firstLaunch, setFirstLaunch] = useState<boolean>();
  useEffect(() => {
    async function setData() {
      const isFirstLaunch = await AsyncStorage.getItem("isFirstLaunch");
      if (isFirstLaunch == null) {
        setFirstLaunch(true);
        AsyncStorage.setItem("isFirstLaunch", "false");
      } else {
        setFirstLaunch(false);
      }
    }
    setData();
  }, []);

  return (
    firstLaunch != null && (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={firstLaunch ? "OnboardingScreen" : "SignInScreen"}
      >
        {firstLaunch && (
          <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
        )}
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen
          name="AccountSetUpScreen"
          component={AccountSetUpScreen}
        />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
        />
      </Stack.Navigator>
    )
  );
};

export default AuthNavigator;
