import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import {
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
    const getFirstLaunch = async () => {
      try {
        const isFirstLaunch = await AsyncStorage.getItem("firstLaunch");

        if (!isFirstLaunch) {
          setFirstLaunch(true);
          await AsyncStorage.setItem("firstLaunch", "false");
          console.log("yes");
        }
        setFirstLaunch(false);
      } catch (error) {
        console.log(error);
      }
    };
    getFirstLaunch();
  }, []);

  return (
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
    </Stack.Navigator>
  );
};

export default AuthNavigator;
