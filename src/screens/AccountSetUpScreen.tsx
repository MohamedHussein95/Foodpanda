import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Touchable,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import { Appbar, Avatar } from "react-native-paper";
import { useDispatch } from "react-redux";
import { Colors } from "../constants";
import { hp, wp } from "../utils/helpers";

import { CustomLoader, RememberMe } from "../components";
import { useAppSelector } from "../hooks/hooks";
import MapView, { Marker } from "react-native-maps";
import PhoneInput from "react-native-phone-number-input";
import { addUserToStorage } from "../services/authActions";
import { authenticateUser, setUser } from "../redux/userSlice";
import { uploadFile } from "../services/fileActions";

const AccountSetupScreen = ({ navigation }: any) => {
  const { colors, dark } = useTheme();
  const [loading, setLoading] = useState(false);
  const user = useAppSelector((state) => state.user.user);
  const [imgUrl, setImgUrl] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<object>({});
  const [address, setAddress] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [genderToggled, setGenderToggled] = useState(false);
  const [selectedGender, setSelectedGender] = useState("Male");
  const phoneInput = useRef<PhoneInput>(null);
  const [value, setValue] = useState<string>("");
  const [formattedValue, setFormattedValue] = useState<string>("");
  const [checked, setChecked] = useState(true);
  const [promoChecked, setPromoChecked] = useState(true);
  const dispatch = useDispatch();

  const animatedValue = useRef(new Animated.Value(0)).current;
  const expandedHeight = hp(14);

  const handleGendertoggle = () => {
    const toValue = genderToggled ? 0 : expandedHeight;

    Animated.timing(animatedValue, {
      toValue,
      duration: 250,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();

    setGenderToggled(!genderToggled);
  };

  const handleProfilePhoto = async () => {
    setModalOpen(true);
  };

  const handleCamera = async () => {
    setModalOpen(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

    if (!result.canceled) {
      handleImageChange(result.assets[0].uri);
      let base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;
    }
  };
  const handleGallery = async () => {
    setModalOpen(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

    if (!result.canceled) {
      handleImageChange(result.assets[0].uri);
      let base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;
    }
  };

  const handleImageChange = (localUri: string) => {
    setImgUrl(localUri);
    console.log(localUri);
  };

  const onModalClose = () => {
    setModalOpen(false);
  };

  const handleUploadPicture = async () => {
    try {
      let url;
      if (imgUrl) {
        url = await uploadFile(
          imgUrl,
          imgUrl.split("/").pop(),
          "profilePhotos"
        );
      }
      console.log(url);
      return url;
    } catch (error) {
      console.log(error);
    }
  };

  const handleContinue = async (userName: string) => {
    setLoading(true);
    const body = {
      uid: user.uid,
      fullName,
      avatar: await handleUploadPicture(),
      phoneNumber: formattedValue,
      address,
      gender: selectedGender,
      notification: checked,
      promotionalNotification: promoChecked,
    };

    try {
      const res = await addUserToStorage(body);
      dispatch(setUser({ user: { ...user, ...body } }));
      setLoading(false);
      dispatch(authenticateUser());
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const handleSkip = async (userName: string) => {
    try {
    } catch (error) {}
  };

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

  // useEffect(() => {
  //   if (userLocation) {
  //     reversedGeoCode();
  //   }
  // }, [userLocation]);
  // const reversedGeoCode = async () => {
  //   const reversedGeoLocation = await Location.reverseGeocodeAsync({
  //     longitude: userLocation?.coords?.longitude,
  //     latitude: userLocation?.coords?.latitude,
  //   });

  //   setAddress(
  //     `${reversedGeoLocation[0].street},${reversedGeoLocation[0].city}`
  //   );
  // };

  const isValid =
    imgUrl.length !== 0 &&
    address.length !== 0 &&
    selectedGender.length !== 0 &&
    phoneInput.current?.isValidNumber(value);

  return (
    <KeyboardAvoidingView
      style={styles(colors).screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          gap: hp(5),
          paddingVertical: hp(6),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: wp(3),
          }}
        >
          <FontAwesome
            name="angle-left"
            size={wp(7)}
            color={colors.text}
            onPress={() => navigation.goBack()}
          />

          <Text
            style={{
              fontFamily: "SemiBold",
              fontSize: wp(4.5),
              color: colors.text,
            }}
          >
            Setup Account
          </Text>
          <Text
            style={{
              fontFamily: "SemiBold",
              fontSize: wp(4.5),
              color: colors.primary,
            }}
            onPress={handleSkip}
          >
            Skip
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            paddingHorizontal: wp(3),
            gap: hp(2),
          }}
        >
          <Text
            style={{ color: colors.text, fontFamily: "Bold", fontSize: wp(4) }}
          >
            Profile Photo
          </Text>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: wp(30),
              aspectRatio: 1,
              alignSelf: "center",
            }}
          >
            {imgUrl ? (
              <TouchableOpacity onPress={handleProfilePhoto}>
                <Image
                  source={{ uri: imgUrl }}
                  resizeMode="cover"
                  style={styles(colors).profile}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles(colors).profile}
                onPress={handleProfilePhoto}
              />
            )}
            <Avatar.Icon
              icon={"plus"}
              size={wp(8)}
              style={styles(colors).plusIcon}
            />
          </View>
        </View>

        <View style={styles(colors).inputCon}>
          <Text
            style={{
              color: colors.text,
              fontFamily: "Bold",
              fontSize: wp(4),
            }}
          >
            Full Name
          </Text>
          <View style={styles(colors).inputsWrapper}>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              style={styles(colors).input}
              cursorColor={colors.primary}
              autoCapitalize="words"
              autoComplete="name"
              maxLength={30}
            />
          </View>
          <Text
            style={{
              color: colors.text,
              fontFamily: "Bold",
              fontSize: wp(4),
            }}
          >
            Gender
          </Text>
          <TouchableOpacity
            style={[styles(colors).inputsWrapper]}
            onPress={handleGendertoggle}
          >
            <Text style={{ color: colors.darkGrey }}>{selectedGender}</Text>
          </TouchableOpacity>

          <Animated.View
            style={{
              maxHeight: expandedHeight,
              overflow: "hidden",
              backgroundColor: colors.lightGrey,
              paddingHorizontal: wp(3),
              marginTop: -12,
              borderRadius: wp(2),
              elevation: 1,
              shadowColor: Colors.primary100,
              shadowOffset: { width: 0, height: 1 },
              shadowRadius: wp(2),
              shadowOpacity: 0.5,
              height: animatedValue,
            }}
          >
            <TouchableOpacity
              style={{
                paddingTop: hp(1),
              }}
              onPress={() => {
                setSelectedGender("Male");
                handleGendertoggle();
              }}
            >
              <Text
                style={{
                  color: colors.darkGrey,
                  fontFamily: "Bold",
                  fontSize: wp(4),
                }}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingTop: hp(1),
              }}
              onPress={() => {
                setSelectedGender("Female");
                handleGendertoggle();
              }}
            >
              <Text
                style={{
                  color: colors.darkGrey,
                  fontFamily: "Bold",
                  fontSize: wp(4),
                }}
              >
                Female
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingTop: hp(1),
              }}
              onPress={() => {
                setSelectedGender("Not Sure");
                handleGendertoggle();
              }}
            >
              <Text
                style={{
                  color: colors.darkGrey,
                  fontFamily: "Bold",
                  fontSize: wp(4),
                }}
              >
                Not Sure
              </Text>
            </TouchableOpacity>
          </Animated.View>
          <Text
            style={{
              color: colors.text,
              fontFamily: "Bold",
              fontSize: wp(4),
            }}
          >
            Phone Number
          </Text>
          <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode="KE"
            layout="first"
            onChangeText={(text) => {
              setValue(text);
            }}
            onChangeFormattedText={(text) => {
              setFormattedValue(text);
            }}
            containerStyle={styles(colors).inputsWrapper}
            textInputStyle={styles(colors).input}
            placeholderTextColor={colors.darkGrey}
            textContainerStyle={{
              backgroundColor: colors.lightGrey,
            }}
            flagButtonStyle={{
              width: wp(15),
              backgroundColor: colors.lightGrey,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            paddingHorizontal: wp(3),
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontFamily: "Bold",
              fontSize: wp(4),
            }}
          >
            Notifications
          </Text>
          <RememberMe
            status={checked}
            onPress={() => setChecked(!checked)}
            size={0.5}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            paddingHorizontal: wp(3),
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontFamily: "Bold",
              fontSize: wp(4),
            }}
          >
            Promotional Notifications
          </Text>
          <RememberMe
            status={promoChecked}
            onPress={() => setPromoChecked(!promoChecked)}
            size={0.5}
          />
        </View>

        <View style={{ width: "95%", gap: hp(2), marginTop: hp(2) }}>
          <Text
            style={{ color: colors.text, fontFamily: "Bold", fontSize: wp(4) }}
          >
            Add a new Address
          </Text>
          <View
            style={{
              overflow: "hidden",
              borderRadius: wp(3),
              width: wp(95),
              height: hp(30),
            }}
          >
            {userLocation && <MapView style={styles(colors).map} />}
          </View>
          <View style={styles(colors).inputsWrapper}>
            <TextInput
              value={address}
              onChangeText={setAddress}
              style={styles(colors).input}
              placeholder="Enter your address"
              cursorColor={colors.primary}
              autoComplete="address-line1"
              autoCapitalize="words"
            />
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[
          styles(colors).button,
          {
            backgroundColor: isValid ? colors.primary : colors.mediumGrey,
            marginVertical: hp(4),
          },
        ]}
        onPress={handleContinue}
        disabled={!isValid}
      >
        <Text style={styles(colors).buttText}>Continue</Text>
      </TouchableOpacity>
      <Modal
        onBackdropPress={onModalClose}
        onBackButtonPress={onModalClose}
        isVisible={modalOpen}
        onSwipeComplete={onModalClose}
        animationOut="bounceOutDown"
        animationInTiming={100}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
        style={styles(colors).modal}
      >
        <View style={styles(colors).modalContainer}>
          <Text
            style={{
              fontFamily: "SemiBold",
              fontSize: wp(5),
              textAlign: "center",
              marginBottom: wp(1),
              color: colors.text,
            }}
          >
            Choose an action
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              style={styles(colors).actionButton}
              activeOpacity={0.7}
              onPress={handleCamera}
            >
              <MaterialIcons
                name="camera-alt"
                size={wp(10)}
                color={Colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles(colors).actionButton}
              activeOpacity={0.7}
              onPress={handleGallery}
            >
              <MaterialIcons
                name="insert-photo"
                size={wp(10)}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <CustomLoader visible={loading} />
    </KeyboardAvoidingView>
  );
};

export default AccountSetupScreen;

const styles = (colors: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },

    profile: {
      position: "relative",
      width: wp(30),
      aspectRatio: 1,
      borderRadius: wp(50),
      alignSelf: "center",
      backgroundColor: colors.lightGrey,
    },
    plusIcon: {
      position: "absolute",
      bottom: 0,
      right: 0,
      borderWidth: wp(1),
      borderColor: colors.background,
      backgroundColor: colors.primary,
    },
    modalContainer: {
      paddingVertical: hp(4),
      paddingHorizontal: wp(3),
      borderTopLeftRadius: wp(3),
      borderTopRightRadius: wp(3),
      backgroundColor: colors.lightGrey,
    },

    modal: {
      justifyContent: "flex-end",
      margin: 0,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: wp(3),
      width: "100%",
    },
    actionButton: {
      backgroundColor: colors.primary,
      padding: wp(5),
      borderRadius: wp(50),
      overflow: "hidden",
      elevation: 1,
      marginVertical: hp(2),
    },

    inputsWrapper: {
      backgroundColor: colors.lightGrey,
      paddingHorizontal: wp(3),
      height: hp(8),
      borderRadius: wp(2),
      elevation: 1,

      flexDirection: "row",
      alignItems: "center",
      gap: wp(3),
      width: "100%",
    },
    input: {
      flex: 1,
      color: colors.darkGrey,
      fontFamily: "Medium",
      fontSize: wp(4),
    },
    map: {
      width: "100%",
      aspectRatio: 1,
    },
    button: {
      padding: wp(4),
      width: wp(95),
      justifyContent: "center",
      alignItems: "center",
      elevation: 1,

      borderRadius: hp(1),
      alignSelf: "center",
      marginVertical: hp(2),
    },
    buttText: {
      fontSize: wp(5),
      fontFamily: "Bold",
      color: Colors.white,
      letterSpacing: wp(0.1),
    },
    inputCon: {
      width: "95%",
      gap: hp(2),
      marginTop: hp(2),
    },
  });
