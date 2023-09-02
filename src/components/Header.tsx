import { StyleSheet, Text, View, Platform, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../constants";
import { Appbar } from "react-native-paper";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import * as Location from "expo-location";
import { useAppSelector } from "../hooks/hooks";

const isIos = Platform.OS === "ios";

const Header = () => {
  const { colors } = useTheme();

  const user = useAppSelector((state) => state.user.user);
  const [userLocation, setUserLocation] = useState<object>({});
  const [address, setAddress] = useState<Array<object>>([]);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
      } catch (error) {
        console.log("Error getting user location:", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (userLocation) {
      reversedGeoCode();
    }
  }, [userLocation]);
  const reversedGeoCode = async () => {
    const reversedGeoLocation = await Location.reverseGeocodeAsync({
      longitude: userLocation?.coords?.longitude,
      latitude: userLocation?.coords?.latitude,
    });
    setAddress(reversedGeoLocation);
  };

  return (
    <View style={styles(colors).header}>
      <View style={styles(colors).headerBar}>
        <View style={styles(colors).headerLeft}>
          <Feather
            name="menu"
            color={isIos ? Colors.primary500 : Colors.white}
            size={35}
          />
          <View style={styles(colors).headerTitle}>
            {address ? (
              <Text
                style={styles(colors).address}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {address[0]?.street}
              </Text>
            ) : (
              <Text
                style={styles(colors).address}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Murambi Street
              </Text>
            )}

            {user?.displayName ? (
              <Text
                style={styles(colors).name}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user?.displayName}
              </Text>
            ) : (
              <Text
                style={styles(colors).name}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Guest
              </Text>
            )}
          </View>
        </View>

        <Ionicons
          name="cart-outline"
          size={35}
          color={isIos ? Colors.primary500 : Colors.white}
        />
      </View>
      <View style={styles(colors).searchContainer}>
        <AntDesign
          name="search1"
          size={30}
          color={isIos ? colors.mediumGrey : Colors.disabled}
        />
        <TextInput
          placeholder={"Search for shops & restaurants"}
          cursorColor={Colors.primary500}
          placeholderTextColor={isIos ? colors.mediumGrey : Colors.disabled}
          style={styles(colors).search}
        />
      </View>
      <StatusBar
        style={isIos ? "dark" : "light"}
        backgroundColor={Colors.primary500}
      />
    </View>
  );
};

export default Header;

const styles = (colors: object) =>
  StyleSheet.create({
    header: {
      ...Platform.select({
        ios: {
          backgroundColor: colors.background,
        },
        android: {
          backgroundColor: colors.primary,
        },
      }),
      padding: 15,
    },
    headerBar: {
      flexDirection: "row",
    },
    headerLeft: {
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      gap: 15,
    },
    address: {
      fontFamily: "Bold",
      fontSize: 18,
      ...Platform.select({
        ios: {
          color: colors.text,
        },
        android: {
          color: Colors.white,
        },
      }),
    },
    name: {
      fontFamily: "Medium",
      fontSize: 16,
      ...Platform.select({
        ios: {
          color: colors.text,
        },
        android: {
          color: Colors.white,
        },
      }),
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      ...Platform.select({
        ios: {
          backgroundColor: colors.card,
        },
        android: {
          backgroundColor: Colors.white,
        },
      }),
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 50,
      marginTop: 15,
    },
    search: {
      fontFamily: "Medium",
      fontSize: 16,
      ...Platform.select({
        ios: {
          color: colors.text,
        },
        android: {
          color: Colors.dark2,
        },
      }),
    },
    headerTitle: {
      width: "50%",
    },
  });
