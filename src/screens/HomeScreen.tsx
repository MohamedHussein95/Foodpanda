import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomLoader, Header, HeroSection } from "../components";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { auth } from "../firebaseConfig";
import { updateUserProfile } from "../services/authActions";
import { boolean } from "yup";
import { useEvent } from "react-native-reanimated";
import Toast from "react-native-root-toast";
import { Colors } from "../constants";

const HomeScreen = () => {
  const user = useAppSelector((state) => state.user.user);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async function () {
      try {
        const userProfileData = {
          displayName: user?.displayName,
          avatar: user?.photoURL,
          phoneNumber: user?.phoneNumber,
        };
        console.log(userProfileData);

        if (
          !userProfileData.displayName ||
          !userProfileData.avatar ||
          !userProfileData.phoneNumber
        ) {
          setLoading(true);
          await updateUserProfile(userProfileData);
          setLoading(false);
        }
      } catch (error: any) {
        setLoading(false);

        Toast.show(error?.message, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          animation: true,
          delay: 0,
        });
      }
    })();
  }, []);

  return (
    <View className="flex-1 ">
      <SafeAreaView>
        <Header />
        <HeroSection />
      </SafeAreaView>
      <CustomLoader visible={loading} />
    </View>
  );
};

export default HomeScreen;
