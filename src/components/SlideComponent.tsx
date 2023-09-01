import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { DEVICE_HEIGHT, DEVICE_WIDTH, hp, wp } from "../utils/helpers";
import { useTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

interface SlideProps {
  title: string;
  content: string;
  image: string;
}

const SlideComponent = ({ title, content, image }: SlideProps) => {
  const { colors, dark } = useTheme();
  return (
    <>
      <View style={styles(colors).container}>
        <Image
          source={image}
          style={styles(colors).image}
          resizeMode="contain"
        />
        <View style={styles(colors).textContainer}>
          <Text style={styles(colors).title}>{title}</Text>
          <Text style={styles(colors).content}>{content}</Text>
        </View>
      </View>
      <StatusBar style={dark ? "light" : "dark"} />
    </>
  );
};

export default SlideComponent;

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: DEVICE_WIDTH,
      justifyContent: "flex-start",
      alignItems: "center",
      marginTop: hp(3),
    },
    image: {
      height: hp(50),
      aspectRatio: 1,
      marginBottom: hp(2),
    },

    title: {
      fontSize: wp(7),
      fontFamily: "Bold",
      marginBottom: hp(4),
      color: colors.text,
    },
    content: {
      fontSize: wp(4.5),
      fontFamily: "Medium",
      textAlign: "center",
      color: colors.text,
    },
    textContainer: {
      width: wp(80),
      alignItems: "center",
      justifyContent: "center",
    },
  });
