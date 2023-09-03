import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch } from "@reduxjs/toolkit";
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateCurrentUser,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import moment from "moment";
import { auth, db } from "../firebaseConfig";
import { authenticateUser, logOut, setUser } from "../redux/userSlice";
import { capitalizeWords } from "../utils/helpers";
import { getUserData } from "./userActions";

let timeOut = null;

export const signUp = async (
  email: string,
  password: string,
  dispatch: Dispatch,
  userName: string
) => {
  try {
    const userRef = collection(db, "Users");

    const q = query(
      userRef,
      where("userName", "==", `${userName.toLowerCase()}`)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.size > 0) {
      throw new Error("User name is already taken!");
    }
    const result = await createUserWithEmailAndPassword(
      auth,
      email.toLowerCase(),
      password
    );
    await setDoc(doc(db, "Users", `${result.user.uid}`), {
      userName: userName.toLowerCase(),
      email: email.toLowerCase(),
    });

    const { uid, stsTokenManager } = await result.user.toJSON();
    const { accessToken, expirationTime } = stsTokenManager;

    dispatch(
      setUser({
        user: { ...result.user.toJSON(), userName, email },
        token: accessToken,
      })
    );

    const expiryDate = new Date(expirationTime);
    console.log(moment(expiryDate).format("HH:mm"));

    const timeNow = new Date();

    const msTillExpirationTime = expiryDate.getTime() - timeNow.getTime();

    storeUserData(accessToken, uid, expiryDate);

    const secondsTillExpirationTime = msTillExpirationTime / 1000;

    timeOut = setTimeout(() => {
      dispatch(logOut());
    }, secondsTillExpirationTime * 1000);

    return result.user.toJSON();
  } catch (error: any) {
    // console.log(error.code);
    let message = "Something went wrong!";

    if (error.code === "auth/email-already-in-use") {
      message = "Email taken!";
    }
    if (error.code === "auth/wrong-password") {
      message = "Invalid credentials!";
    }
    if (error.message === "User name is already taken!") {
      message = "User name is already taken!";
    }
    throw new Error(message);
  }
};
export const signIn = async (
  email: string,
  password: string,
  dispatch: Dispatch
) => {
  try {
    const result = await signInWithEmailAndPassword(
      auth,
      email.toLowerCase(),
      password
    );

    const { uid, stsTokenManager } = await result.user.toJSON();
    const { accessToken, expirationTime } = stsTokenManager;

    const userData = await getUserData(uid);

    dispatch(
      setUser({
        user: { ...result.user.toJSON(), ...userData },
        token: accessToken,
      })
    );

    const expiryDate = new Date(expirationTime);
    console.log(moment(expiryDate).format("HH:mm"));

    const timeNow = new Date();

    const msTillExpirationTime = expiryDate.getTime() - timeNow.getTime();

    storeUserData(accessToken, uid, expiryDate);

    const secondsTillExpirationTime = msTillExpirationTime / 1000;

    timeOut = setTimeout(() => {
      dispatch(logOut());
    }, secondsTillExpirationTime * 1000);
    dispatch(authenticateUser());
  } catch (error: any) {
    console.log(error.code);
    let message = "Something went wrong!";

    if (error.code === "auth/invalid-email") {
      message = "Invalid email!";
    }
    if (error.code === "auth/wrong-password") {
      message = "Invalid credentials!";
    }
    if (error.code === "auth/user-disabled") {
      message = "Account disabled!";
    }
    if (error.code === "auth/user-not-found") {
      message = "User not found!";
    }
    throw new Error(message);
  }
};

export const addUserToStorage = async ({
  uid,
  fullName,
  phoneNumber,
  address,
  gender,
  avatar,
  notification,
  promotionalNotification,
}: {
  uid: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  gender: string;
  avatar: string | undefined;
  notification: boolean;
  promotionalNotification: boolean;
}) => {
  try {
    const body = {
      fullName: capitalizeWords(fullName),
      avatar,
      phoneNumber,
      address,
      gender: capitalizeWords(gender),
      notification,
      promotionalNotification,
    };
    const docExists = (await getDoc(doc(db, "Users", `${uid}`))).id;
    console.log("doc exists", docExists);

    if (!docExists) {
      await setDoc(doc(db, "Users", `${uid}`), body);
    } else {
      await updateDoc(doc(db, "Users", `${uid}`), body);
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

export const storeUserData = (token: string, uid: string, expiryDate: Date) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      uid,
      expiryDate: expiryDate.toISOString(),
    })
  );
};

export const updateUserProfile = async ({
  displayName,
  avatar,
  phoneNumber,
}: {
  displayName: string;
  avatar: string;
  phoneNumber: string;
}) => {
  try {
    await updateCurrentUser(auth, {
      phoneNumber,
      displayName,
      photoURL: avatar,
    });
  } catch (error: any) {
    console.log(error);

    throw new Error(error);
  }
};
