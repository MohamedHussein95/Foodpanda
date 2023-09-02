import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Dispatch } from "@reduxjs/toolkit";
import { auth, db } from "../firebaseConfig";
import { authenticateUser, setUser } from "../redux/userSlice";
import { capitalizeWords } from "../utils/helpers";

export const signUp = async (
  email: string,
  password: string,
  dispatch: Dispatch,
  userName: string
) => {
  try {
    const res = await createUserWithEmailAndPassword(
      auth,
      email.toLowerCase(),
      password
    );
    await setDoc(doc(db, "Users", `${res.user.uid}`), {
      userName: userName.toLowerCase(),
      email: email.toLowerCase(),
    });
    dispatch(setUser(res.user.toJSON()));
    return res.user.toJSON();
  } catch (error: any) {
    console.log(error.code);
    let message = "Something went wrong!";

    if (error.code === "auth/email-already-in-use") {
      message = "Email taken!";
    }
    if (error.code === "auth/wrong-password") {
      message = "Invalid credentials!";
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
    const res = await signInWithEmailAndPassword(
      auth,
      email.toLowerCase(),
      password
    );

    dispatch(setUser(res.user.toJSON()));
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
  avatar: string;
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

    if (!docExists) {
      const docRef = await setDoc(doc(db, "Users", `${uid}`), body);
    } else {
      const docRef = await updateDoc(doc(db, "Users", `${uid}`), body);
    }
    await updateProfile(auth.currentUser, {
      displayName: fullName,
      photoURL: avatar,
    });
  } catch (error) {
    console.log(error);
  }
};
