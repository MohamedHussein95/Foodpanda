import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { hp, wp } from "../utils/helpers";
import { FontAwesome } from "@expo/vector-icons";
import { Badge } from "react-native-paper";

const BottomTabBar = ({ state, descriptors, navigation }: any) => {
  const { colors, dark } = useTheme();

  return (
    <Animated.View
      style={{
        height: hp(6),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
      }}
      entering={FadeInDown}
      exiting={FadeOutDown}
    >
      {state.routes.map((route: any, index: any) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        let iconName = null;

        if (route.name === "HomeScreen") {
          iconName = isFocused ? (
            <FontAwesome name="home" size={24} color={colors.primary} />
          ) : (
            <FontAwesome name="home" size={24} color={colors.text} />
          );
        } else if (route.name === "ProfileScreen") {
          iconName = isFocused ? (
            <FontAwesome name="user" size={24} color={colors.primary} />
          ) : (
            <FontAwesome name="user" size={24} color={colors.text} />
          );
        }
        // Add more conditions for other tab routes

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            style={[styles.tabItem, isFocused && styles.tabItemFocused]}
            onPress={onPress}
          >
            {iconName}
            {isFocused && (
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  backgroundColor: colors.primary,
                  width: wp(2),
                  aspectRatio: 1,
                  borderRadius: wp(50),
                }}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: hp(6),
    position: "relative",
  },
  tabItemFocused: {},
});

export default BottomTabBar;
