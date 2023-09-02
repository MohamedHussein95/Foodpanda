import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Dispatch } from "@reduxjs/toolkit";
import { auth, db } from "../firebaseConfig";
import { setUser } from "../redux/userSlice";
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
  } catch (error) {
    console.log(error);
  }
};

const addUserToStorage = async (
  uid: string,
  fullName: string,
  phoneNumber: string,
  address: string,
  gender: string,
  notification: boolean,
  promotionalNotification: boolean
) => {
  try {
    const body = {
      fullName: capitalizeWords(fullName),
      phoneNumber,
      address,
      gender: capitalizeWords(gender),
      notification,
      promotionalNotification,
    };
    const docRef = await setDoc(doc(db, "Users", `${uid}`), body);
  } catch (error) {
    console.log(error);
  }
};
