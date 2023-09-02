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
  email: Yup.string()
    .email("Please enter a valid email address")
    .required()
    .label("Email")
    .test("email", "Invalid email address", (value) => {
      return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
    }),
  password: Yup.string()
    .min(8, ({ min }) => `Password must be at least ${min} characters!`)
    .required()
    .label("Password"),
  userName: Yup.string()
    .test(
      "no-white-space",
      "User Name cannot contain white spaces",
      (value: any) => {
        return !/\s/.test(value); // Test if value contains white spaces
      }
    )
    .matches(/^@[^-]/, 'User Name must start with "@" symbol')
    .min(3)
    .max(15)
    .required()
    .label("User Name"),
});

const SignUpScreen = ({ navigation }: any) => {
  const isConnected = useNetworkState();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const [hidePassword, setHidePassword] = useState(true);
  const [checked, setChecked] = useState(true);

  const handleSignUp = async (email: string, password: string) => {
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
          <FontAwesome name="angle-left" size={wp(7)} color={colors.text} />
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
              Sign UP
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
            Create Account
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("SignInScreen")}
            style={{}}
          >
            <Text
              style={{
                fontFamily: "Medium",
                fontSize: wp(4),
                color: colors.text,
              }}
            >
              Enter your Name,Email and Password for sign up.
              <Text
                style={{
                  fontFamily: "Medium",
                  fontSize: wp(4),
                  color: colors.primary,
                }}
              >
                Already have account?
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
        <Formik
          initialValues={{ userName: "@", email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSignUp(values.email, values.password)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <View style={styles(colors).inputCon}>
              <View
                style={[
                  styles(colors).inputsWrapper,
                  {
                    borderWidth: !errors.userName && touched.userName ? 1 : 0,
                    borderColor:
                      !errors.userName && touched.userName
                        ? Colors.success
                        : null,
                  },
                ]}
              >
                {!errors.userName && touched.userName ? (
                  <Feather
                    style={styles(colors).icon}
                    name="user"
                    size={wp(6)}
                    color={Colors.success}
                  />
                ) : (
                  <Feather
                    style={styles(colors).icon}
                    name="user"
                    size={wp(6)}
                    color={colors.mediumGrey}
                  />
                )}

                <TextInput
                  name="userName"
                  placeholder="User name"
                  value={values.userName}
                  onBlur={handleBlur("userName")}
                  onChangeText={handleChange("userName")}
                  style={styles(colors).input}
                  placeholderTextColor={colors.mediumGrey}
                  cursorColor={colors.primary}
                  defaultValue="@"
                />
              </View>

              {errors.userName && touched.userName ? (
                <View style={styles(colors).errorContainer}>
                  <Text
                    style={{
                      color: Colors.error,
                      fontSize: wp(3),
                      fontFamily: "Medium",
                    }}
                  >
                    {errors.userName}
                  </Text>
                </View>
              ) : null}
              <View
                style={[
                  styles(colors).inputsWrapper,
                  {
                    borderWidth: !errors.email && touched.email ? 1 : 0,
                    borderColor:
                      !errors.email && touched.email ? Colors.success : null,
                  },
                ]}
              >
                {!errors.email && touched.email ? (
                  <MaterialCommunityIcons
                    style={styles(colors).icon}
                    name="email-outline"
                    size={wp(6)}
                    color={Colors.success}
                  />
                ) : (
                  <MaterialCommunityIcons
                    style={styles(colors).icon}
                    name="email-outline"
                    size={wp(6)}
                    color={colors.mediumGrey}
                  />
                )}

                <TextInput
                  name="email"
                  placeholder="Email address"
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
              <View
                style={[
                  styles(colors).inputsWrapper,
                  {
                    borderWidth: !errors.password && touched.password ? 1 : 0,
                    borderColor:
                      !errors.password && touched.password
                        ? Colors.success
                        : null,
                  },
                ]}
              >
                {!errors.password && touched.password ? (
                  <Feather
                    style={styles(colors).icon}
                    name="lock"
                    size={wp(6)}
                    color={Colors.success}
                  />
                ) : (
                  <Feather
                    style={styles(colors).icon}
                    name="lock"
                    size={wp(6)}
                    color={colors.mediumGrey}
                  />
                )}

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
                {hidePassword && !errors.password && touched.password ? (
                  <Octicons
                    style={styles(colors).icon}
                    name="eye-closed"
                    size={wp(6)}
                    color={Colors.success}
                    onPress={() => setHidePassword(!hidePassword)}
                  />
                ) : !hidePassword && !errors.password && touched.password ? (
                  <Octicons
                    style={styles(colors).icon}
                    name="eye"
                    size={wp(6)}
                    color={Colors.success}
                    onPress={() => setHidePassword(!hidePassword)}
                  />
                ) : hidePassword ? (
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

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!isValid}
                activeOpacity={0.8}
                style={[
                  styles(colors).button,
                  {
                    backgroundColor:
                      !isValid || loading ? colors.lightGrey : colors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles(colors).buttText,
                    {
                      color:
                        !isValid || loading ? colors.mediumGrey : Colors.white,
                    },
                  ]}
                >
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

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

export default SignUpScreen;

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
      elevation: 1,
      shadowColor: Colors.primary100,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: wp(2),
      shadowOpacity: 0.5,
      flexDirection: "row",
      alignItems: "center",
      gap: wp(3),
    },
    input: {
      flex: 1,
      color: colors.darkGrey,
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
