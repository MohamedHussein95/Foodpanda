import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useTheme } from "@react-navigation/native";
import { HomeScreen } from "../screens";

import { Platform } from "react-native";
import { BottomTabBar } from "../components";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabStack = () => {
  const { colors, dark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mediumGrey,

        headerShown: false,
      })}
      tabBar={(props: any) => <BottomTabBar {...props} />}
    >
      <Tab.Screen component={HomeScreen} name="HomeScreen" />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TabStack" component={TabStack} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
