import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { BounceInUp, BounceOutUp } from "react-native-reanimated";
import * as Yup from "yup";
import { CustomLoader, RememberMe } from "../components";
import { Colors } from "../constants";
import useNetworkState from "../hooks/useNetworkState";
import { hp, wp } from "../utils/helpers";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().label("Email"),
  password: Yup.string().required().label("Password"),
});

const SignInScreen = ({ navigation }: any) => {
  const isConnected = useNetworkState();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const [numberOfTries, setNumberOfTries] = useState(3);
  const [outOfTries, setOutOfTries] = useState(false);
  const [seconds, setSeconds] = useState(29);
  const [hidePassword, setHidePassword] = useState(true);
  const [checked, setChecked] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      if (checked) {
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("password", password);
      } else {
        if (
          (await AsyncStorage.getItem("email")) &&
          (await AsyncStorage.getItem("password"))
        ) {
          await AsyncStorage.removeItem("email");
          await AsyncStorage.removeItem("password");
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setNumberOfTries((prev) => prev - 1);
      Toast.show(error?.message || error?.data?.message || error, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        delay: 0,
        containerStyle: {
          borderRadius: wp(50),
          padding: wp(3),
          paddingVertical: 0,
        },
      });
    }
  };

  useEffect(() => {
    if (numberOfTries <= 0) {
      setOutOfTries(true);
    }
  }, [numberOfTries]);
  useEffect(() => {
    if (seconds <= 0) {
      setOutOfTries(false);
      setNumberOfTries(3);
    }
  }, [seconds]);
  useEffect(() => {
    let timer;
    if (outOfTries) {
      timer = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    } else {
      setSeconds(29);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [outOfTries]);

  useEffect(() => {
    (async function () {
      const email = await AsyncStorage.getItem("email");
      const password = await AsyncStorage.getItem("password");
      setEmail(email);
      setPassword(password);
    })();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles(colors).screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      {!isConnected && (
        <Animated.View
          style={{
            backgroundColor: Colors.error,
            justifyContent: "center",
            alignItems: "center",
            height: hp(10),
          }}
          entering={BounceInUp.duration(300)}
          exiting={BounceOutUp.duration(300)}
        >
          <Text
            style={{ fontFamily: "Bold", fontSize: wp(5), color: Colors.white }}
          >
            Check Your Internet Connection !
          </Text>
        </Animated.View>
      )}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingTop: hp(5),
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: wp(3),
          }}
        >
          <FontAwesome
            name="angle-left"
            size={wp(7)}
            color={colors.text}
            onPress={() => navigation.goBack()}
          />
          <View
            style={{
              flex: 1,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "SemiBold",
                fontSize: wp(4.5),
                color: colors.text,
              }}
            >
              Sign in
            </Text>
          </View>
        </View>
        <View
          style={{
            width: wp(85),
            marginVertical: hp(5),
            alignSelf: "flex-start",
            marginHorizontal: wp(3),
          }}
        >
          <Text
            style={{
              fontFamily: "Bold",
              fontSize: wp(5),
              color: colors.text,
              marginBottom: hp(2),
            }}
          >
            Welcome to Foodpanda
          </Text>
          <Text
            style={{
              fontFamily: "Medium",
              fontSize: wp(4),
              color: colors.text,
            }}
          >
            Enter your phone number or email address for signin.Enjoy your food
          </Text>
        </View>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSignIn(values.email, values.password)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles(colors).inputCon}>
              <View style={styles(colors).inputsWrapper}>
                <MaterialCommunityIcons
                  style={styles(colors).icon}
                  name="email-outline"
                  size={wp(6)}
                  color={colors.mediumGrey}
                />
                <TextInput
                  name="email"
                  placeholder="Email"
                  value={values.email}
                  onBlur={handleBlur("email")}
                  onChangeText={handleChange("email")}
                  style={styles(colors).input}
                  placeholderTextColor={colors.mediumGrey}
                  cursorColor={colors.primary}
                  keyboardType="email-address"
                />
              </View>
              {errors.email && touched.email ? (
                <View style={styles(colors).errorContainer}>
                  <Text
                    style={{
                      color: Colors.error,
                      fontSize: wp(3),
                      fontFamily: "Medium",
                    }}
                  >
                    {errors.email}
                  </Text>
                </View>
              ) : null}
              <View style={styles(colors).inputsWrapper}>
                <Feather
                  style={styles(colors).icon}
                  name="lock"
                  size={wp(6)}
                  color={colors.mediumGrey}
                />
                <TextInput
                  name="password"
                  placeholder="Password"
                  value={values.password}
                  onBlur={handleBlur("password")}
                  onChangeText={handleChange("password")}
                  style={styles(colors).input}
                  placeholderTextColor={colors.mediumGrey}
                  cursorColor={colors.primary}
                  secureTextEntry={hidePassword}
                />
                {hidePassword ? (
                  <Octicons
                    style={styles(colors).icon}
                    name="eye-closed"
                    size={wp(6)}
                    color={colors.mediumGrey}
                    onPress={() => setHidePassword(!hidePassword)}
                  />
                ) : (
                  <Octicons
                    style={styles(colors).icon}
                    name="eye"
                    size={wp(6)}
                    color={colors.mediumGrey}
                    onPress={() => setHidePassword(!hidePassword)}
                  />
                )}
              </View>

              {errors.password && touched.password ? (
                <View style={styles(colors).errorContainer}>
                  <Text
                    style={{
                      color: Colors.error,
                      fontSize: wp(3),
                      fontFamily: "Medium",
                    }}
                  >
                    {errors.password}
                  </Text>
                </View>
              ) : null}
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={styles(colors).toggleContainer}>
                  <RememberMe
                    status={checked}
                    onPress={() => setChecked(!checked)}
                    size={0.5}
                  />
                  <Text style={styles(colors).rememberMeText}>Remember me</Text>
                </View>
                <Pressable
                  onPress={() => navigation.navigate("ForgotPasswordScreen")}
                >
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: wp(4),
                      fontFamily: "Medium",
                    }}
                  >
                    Forgot password
                  </Text>
                </Pressable>
              </View>
              {outOfTries && (
                <View style={{ marginTop: hp(2) }}>
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: wp(3.5),
                      fontFamily: "Medium",
                    }}
                  >
                    You can retry again in {seconds}s
                  </Text>
                </View>
              )}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading || outOfTries}
                activeOpacity={0.8}
                style={[
                  styles(colors).button,
                  {
                    backgroundColor:
                      outOfTries || loading ? colors.lightGrey : colors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles(colors).buttText,
                    {
                      color:
                        outOfTries || loading
                          ? colors.mediumGrey
                          : Colors.white,
                    },
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignUpScreen")}
          style={{
            marginTop: hp(5),
            width: wp(100),
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontFamily: "Medium",
              fontSize: wp(3.5),
            }}
          >
            Don't Have an account?{" "}
          </Text>
          <Text
            style={{
              color: colors.primary,
              fontFamily: "Medium",
              fontSize: wp(3.5),
            }}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "Medium",
            fontSize: wp(4),
            color: colors.text,
            marginVertical: hp(3),
          }}
        >
          OR
        </Text>
        <View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles(colors).socialButt,
              { backgroundColor: Colors.facebook },
            ]}
          >
            <View
              style={{
                backgroundColor: Colors.white,
                paddingVertical: wp(1),
                paddingHorizontal: wp(2.5),
                borderRadius: wp(1),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome
                name="facebook"
                size={wp(4)}
                color={Colors.facebook}
              />
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles(colors).socialText}>
                Connect With Facebook
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles(colors).socialButt,
              { backgroundColor: Colors.google },
            ]}
          >
            <View
              style={{
                backgroundColor: Colors.white,
                paddingVertical: wp(1),
                paddingHorizontal: wp(2),
                borderRadius: wp(1),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../assets/images/google.png")}
                resizeMode="contain"
                style={{ height: wp(4), aspectRatio: 1 }}
              />
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles(colors).socialText}>Connect With Google</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CustomLoader visible={loading} />
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;

const styles = (colors: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    inputCon: {
      width: wp(95),
      gap: hp(1),
      alignItems: "center",
    },
    inputsWrapper: {
      backgroundColor: colors.lightGrey,
      padding: wp(3),
      height: hp(8),
      borderRadius: wp(2),
      flexDirection: "row",
      alignItems: "center",
      gap: wp(3),
      elevation: 1,
      shadowColor: Colors.primary100,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: wp(2),
      shadowOpacity: 0.5,
    },
    input: {
      flex: 1,
      color: colors.text,
      fontFamily: "Medium",
      fontSize: wp(4),
    },
    errorContainer: {
      width: wp(95),
    },
    button: {
      backgroundColor: colors.primary,
      padding: wp(4),
      width: wp(95),
      justifyContent: "center",
      alignItems: "center",
      elevation: 1,
      shadowColor: Colors.primary100,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: wp(1),
      shadowOpacity: 0.5,
      marginTop: hp(3),
      borderRadius: hp(1),
    },
    socialButt: {
      flexDirection: "row",
      padding: wp(3),
      width: wp(95),
      justifyContent: "center",
      alignItems: "center",
      elevation: 1,
      shadowColor: Colors.primary100,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: wp(1),
      shadowOpacity: 0.5,
      marginBottom: hp(2),
      borderRadius: hp(1),
    },
    buttText: {
      fontSize: wp(5),
      fontFamily: "Bold",
      color: Colors.white,
      letterSpacing: wp(0.1),
    },
    socialText: {
      fontSize: wp(4),
      fontFamily: "Medium",
      color: Colors.white,
      letterSpacing: wp(0.1),
    },
    rememberMeText: {
      marginLeft: wp(2.5),
      fontSize: wp(3.5),
      lineHeight: hp(4),
      color: colors.text,
      fontFamily: "Medium",
    },
    toggleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
