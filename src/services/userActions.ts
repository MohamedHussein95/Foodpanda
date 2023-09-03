import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const getUserData = async (uid: string) => {
  try {
    const userDoc = (await getDoc(doc(db, "Users", `${uid}`))).data();
    console.log("doc", userDoc);

    return userDoc;
  } catch (error) {
    console.error(error);
  }
};
