import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebaseConfig";

export const uploadFile = (
  image: string,
  fileName: string | undefined,
  directory: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, `${directory}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.error("Error uploading file:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File uploaded and URL:", downloadURL);
            resolve(downloadURL);
          } catch (error) {
            console.error("Error getting download URL:", error);
            reject(error);
          }
        }
      );
    } catch (error) {
      console.error("Error preparing file for upload:", error);
      reject(error);
    }
  });
};
