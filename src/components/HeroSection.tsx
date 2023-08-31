import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import { hp, wp } from "../utils/helpers";

const HeroSection = () => {
  const { colors } = useTheme();

  return (
    <View style={styles(colors).hero}>
      <View>
        <View style={[styles(colors).card, { height: hp(30) }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles(colors).title}>Food Delivery</Text>
            <Text style={styles(colors).desc}>order food you love</Text>
          </View>

          <Image
            source={require("../assets/images/foodSplash.png")}
            resizeMode="contain"
            style={styles(colors).image}
          />
        </View>
        <View style={[styles(colors).card, { height: hp(26) }]}>
          <Text style={styles(colors).title}>Dine-in</Text>
          <Text style={styles(colors).desc}>Get out to eat for 50% off</Text>
          <Image
            source={require("../assets/images/pot.png")}
            resizeMode="contain"
            style={styles(colors).image}
          />
        </View>
      </View>
      <View>
        <View style={[styles(colors).card, { height: hp(20) }]}>
          <Text style={styles(colors).title}>Shops</Text>
          <Text style={styles(colors).desc}>Top brands to your door</Text>
          <Image
            source={require("../assets/images/shirts.png")}
            resizeMode="contain"
            style={styles(colors).image}
          />
        </View>
        <View style={[styles(colors).card, { height: hp(15) }]}>
          <Text style={styles(colors).title}>Pick-up</Text>
          <Text style={styles(colors).desc}>Self-collect for 50% off</Text>
          <Image
            source={require("../assets/images/parcel.png")}
            resizeMode="contain"
            style={styles(colors).image}
          />
        </View>
        <View style={[styles(colors).card, { height: hp(20) }]}>
          <Text style={styles(colors).title}>pandago</Text>
          <Text style={styles(colors).desc}>Send parcles in a snap</Text>
        </View>
      </View>
    </View>
  );
};

export default HeroSection;

const styles = (colors: any) =>
  StyleSheet.create({
    hero: {
      backgroundColor: colors.lightGrey,
      flexDirection: "row",
      padding: wp(3),
      justifyContent: "center",
    },
    card: {
      position: "relative",
      elevation: 1,
      backgroundColor: colors.background,
      padding: wp(5),
      borderRadius: 12,
      margin: hp(0.5),
      borderWidth: 1,
      borderColor: colors.lightGrey,
      alignItems: "flex-start",
      overflow: "hidden",
    },
    title: {
      fontFamily: "Bold",
      fontSize: wp(4),
      color: colors.text,
    },
    desc: {
      fontFamily: "Medium",
      fontSize: wp(3),
      color: colors.text,
    },
    image: {
      position: "absolute",
      bottom: 0,
      left: 10,
      width: wp(35),
      aspectRatio: 1,
      zIndex: -1,
    },
  });
