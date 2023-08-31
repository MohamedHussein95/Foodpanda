import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header, HeroSection } from "../components";

const HomeScreen = () => {
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
