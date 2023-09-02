import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ActivityIndicator, Modal } from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import { hp, wp } from "../utils/helpers";

const CustomLoader = ({ visible }: { visible: boolean }) => {
  const { colors, dark } = useTheme();
  return (
    <Modal
      contentContainerStyle={{
        backgroundColor: colors.lightGrey,
        justifyContent: "center",
        alignItems: "center",
        height: hp(10),
        alignSelf: "center",
        aspectRatio: 1,
        borderRadius: wp(3),
      }}
      style={{
        flex: 1,
      }}
      visible={visible}
      dismissable={false}
      dismissableBackButton={false}
    >
      <ActivityIndicator size={"small"} color={colors.primary} />
    </Modal>
  );
};

export default CustomLoader;
