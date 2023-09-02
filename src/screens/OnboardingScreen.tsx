import React, { useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DEVICE_WIDTH, hp, wp } from "../utils/helpers";

import { useTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import Animated, { BounceIn } from "react-native-reanimated";
import { SlideComponent } from "../components";
import { Colors } from "../constants";

const SLIDES = [
  {
    id: "1",
    image: require("../assets/images/discover.png"),
    title: "Discover places near you",
    content:
      "We make it simple to find the food you crave.Enter your address and let us do the reset",
  },
  {
    id: "2",
    image: require("../assets/images/order_food.png"),
    title: "Order your favorite",
    content:
      "When you order ,we will hook you up with exclusive coupons specials and rewards",
  },
  {
    id: "3",
    image: require("../assets/images/fast_delivery.png"),
    title: "Fast Delivery",
    content:
      "We make food ordering fast,simple and free no matter if you order online or cash",
  },
];

const OnboardingScreen = ({ navigation }: any) => {
  const { colors, dark } = useTheme();
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const flatlistRef = useRef();
  const updateCurrentSlideIndex = (event: any) => {
    const currentIndex = Math.round(
      event.nativeEvent.contentOffset.x / DEVICE_WIDTH
    );
    setCurrentSlideIndex(currentIndex);
  };
  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex < SLIDES.length) {
      flatlistRef.current.scrollToOffset({
        offset: nextSlideIndex * DEVICE_WIDTH,
      });
      setCurrentSlideIndex(nextSlideIndex);
    } else if (currentSlideIndex === SLIDES.length - 1) {
      navigation.replace("SignInScreen");
    }
  };
  const skip = () => {
    setCurrentSlideIndex(SLIDES.length - 1);
    flatlistRef.current.scrollToEnd();
  };
  return (
    <View style={styles(colors).screen}>
      <FlatList
        ref={flatlistRef}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        data={SLIDES}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SlideComponent
            title={item.title}
            content={item.content}
            image={item.image}
          />
        )}
      />
      <View style={styles(colors).footerContainer}>
        <View style={styles(colors).indicatorContainer}>
          {SLIDES.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles(colors).indicator,
                currentSlideIndex === index && styles(colors).activeIndicator,
              ]}
              entering={BounceIn.delay(300 * index)}
            />
          ))}
        </View>
        <View style={styles(colors).buttonContainer}>
          {currentSlideIndex === SLIDES.length - 1 ? (
            <Animated.View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
              entering={BounceIn}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: wp(3),
                  padding: wp(3),
                  alignItems: "center",
                  justifyContent: "center",
                  elevation: 1,
                  width: "70%",
                  height: wp(17),
                  shadowColor: Colors.primary100,
                  shadowOffset: { width: 0, height: 1 },
                  shadowRadius: wp(3),
                  shadowOpacity: 0.5,
                }}
                onPress={goToNextSlide}
                activeOpacity={0.7}
              >
                <Text className="font-Bold text-xl text-white">
                  Get Started
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <>
              <TouchableOpacity
                onPress={skip}
                activeOpacity={0.7}
                style={{ padding: wp(4) }}
              >
                <Text
                  style={{
                    color: colors.darkGrey,
                    fontFamily: "SemiBold",
                    fontSize: wp(4),
                  }}
                >
                  SKIP
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={goToNextSlide}
                style={{
                  backgroundColor: colors.transBg,
                  borderRadius: wp(50),
                  padding: wp(3),
                  alignItems: "center",
                  justifyContent: "center",
                  elevation: 1,
                  width: wp(17),
                  aspectRatio: 1,
                  shadowColor: Colors.primary100,
                  shadowOffset: { width: 0, height: 1 },
                  shadowRadius: wp(3),
                  shadowOpacity: 0.5,
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontFamily: "Bold",
                    fontSize: wp(3.5),
                  }}
                >
                  NEXT
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = (colors: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    buttonContainer: {
      width: "100%",
      marginBottom: wp(5),
      alignSelf: "center",
      marginTop: hp(7),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: wp(3),
    },
    footerContainer: {
      justifyContent: "space-between",
      paddingHorizontal: wp(3),
    },
    indicatorContainer: {
      flexDirection: "row",
      justifyContent: "center",
    },
    indicator: {
      height: wp(1.5),
      width: wp(3),
      marginHorizontal: wp(1),
      borderRadius: wp(2),
      backgroundColor: colors.grey,
    },
    activeIndicator: {
      borderRadius: wp(3),
      backgroundColor: colors.primary,
    },
  });
