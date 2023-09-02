import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { hp, wp } from "../utils/helpers";
import { useTheme } from "@react-navigation/native";
import { Colors } from "../constants";
import { CustomLoader } from "../components";
import { Appbar } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";

import Toast from "react-native-root-toast";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required")
    .label("Email")
    .test("email", "Invalid email address", (value) => {
      return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
    }),
});

const ForgotPasswordScreen = ({ navigation }) => {
  const { colors, dark } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (email) => {
    try {
      const body = { email };
      setLoading(true);

      setLoading(false);
    } catch (error) {
      setLoading(false);

      Toast.show(error.message || error.data.message || error, {
        position: Toast.positions.BOTTOM,
        duration: Toast.durations.LONG,
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
    <View style={styles(colors).screen}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingVertical: hp(5),
          gap: hp(5),
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
              Forgot Password
            </Text>
          </View>
        </View>
        <View
          style={{
            width: wp(85),
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
            Forgot Password
          </Text>
          <Text
            style={{
              fontFamily: "Medium",
              fontSize: wp(4),
              color: colors.text,
            }}
          >
            Please enter your Email so we can help you recover your password
          </Text>
        </View>
        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleSendOtp(values.email)}
        >
          {({
            handleChange,
            handleBlur,
            handleReset,
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

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}
                style={[
                  styles(colors).button,
                  {
                    backgroundColor: loading
                      ? colors.lightGrey
                      : colors.primary,
                  },
                ]}
              >
                <Text style={styles(colors).buttText}>Reset Password</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
      <CustomLoader visible={loading} />
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = (colors: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    inputCon: {
      width: wp(95),
      gap: hp(5),
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
    textWrapper: {
      alignItems: "center",
      padding: wp(3),
      gap: hp(4),
      backgroundColor: colors.background,
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
    buttText: {
      fontSize: 18,
      fontFamily: "Bold",
      color: "white",
    },
  });
