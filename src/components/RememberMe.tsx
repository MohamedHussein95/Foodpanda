import React, { useState } from "react";
import { TouchableOpacity, Animated, StyleSheet, Easing } from "react-native";
import { Colors } from "../constants";
import { useTheme } from "@react-navigation/native";
import { wp } from "../utils/helpers";

const RememberMe = ({
  size,
  onPress,
  status,
}: {
  size: number;
  onPress: () => void;
  status: boolean;
}) => {
  const initialAnimatedValue = status ? 32 * size : 0;
  const [animatedValue, setAnimatedValue] = useState(
    new Animated.Value(initialAnimatedValue)
  );

  const { colors } = useTheme();

  const toggleHandle = () => {
    Animated.timing(animatedValue, {
      toValue: status ? 0 : 32 * size,
      duration: 250,
      easing: Easing.bounce,
      delay: 0,
      useNativeDriver: true,
    }).start();
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles(colors, size, status).container}
      onPress={() => toggleHandle()}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles(colors, size, status).toggle,
          {
            transform: [
              {
                translateX: animatedValue,
              },
            ],
          },
        ]}
      />
    </TouchableOpacity>
  );
};

export default RememberMe;

const styles = (colors, size, status) =>
  StyleSheet.create({
    container: {
      backgroundColor: status ? colors.primary : colors.mediumGrey,
      height: 32 * size,
      width: 64 * size,
      borderRadius: wp(50),
      padding: 4 * size,
    },
    toggle: {
      height: 24 * size,
      width: 24 * size,
      backgroundColor: Colors.white,
      borderRadius: wp(50),
    },
  });
