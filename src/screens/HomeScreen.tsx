import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header, HeroSection } from "../components";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";

const HomeScreen = () => {
  const user = useAppSelector((state) => state.user.user);
  console.log(user.userName);

  return (
    <View className="flex-1 ">
      <SafeAreaView>
        <Header />
        <HeroSection />
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
