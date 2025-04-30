import { initializeApp } from "firebase/app";
import { doc, updateDoc } from "firebase/firestore";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getFirestore, collection, getDocs, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const fixBlobUrls = async () => {
  const db = getFirestore();
  const storage = getStorage();
  const passengersRef = collection(db, "passengers"); // Adjust to your collection
  const snapshot = await getDocs(passengersRef);

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.personImage && data.personImage.startsWith("blob:")) {
      // Assuming you have the original file or a way to access it
      // If not, you may need to manually re-upload images
      console.log(`Found invalid blob URL for ${doc.id}: ${data.personImage}`);
      // Example: Re-upload a placeholder or fetch the original file
      // const file = ...; // Get the original file
      // const storageRef = ref(storage, `passenger-images/${doc.id}.png`);
      // await uploadBytes(storageRef, file);
      // const downloadURL = await getDownloadURL(storageRef);
      // await updateDoc(doc.ref, { personImage: downloadURL });
    }
  }
};

fixBlobUrls().catch(console.error);

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCIMjEGI-HayQ_qq53XQvVGvjAwt9k-1Wo",
  authDomain: "indus-54d6c.firebaseapp.com",
  projectId: "indus-54d6c",
  storageBucket: "indus-54d6c.appspot.com", // ❗ You wrote wrong (corrected to .app**spot**.com)
  messagingSenderId: "894162220283",
  appId: "1:894162220283:web:ef3f6a22a343f3cde22c5e",
};

// ✅ Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getPassengerByIdentificationNo = async (identificationNo) => {
  const passengersRef = collection(db, "passengers");
  const q = query(
    passengersRef,
    where("identificationNo", "==", identificationNo)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const data = querySnapshot.docs[0].data();
  return data;
};

export const updatePassengerPersonImage = async (barcode, imageUrl) => {
  try {
    const passengerRef = doc(db, "passengers", barcode); // Assuming 'passengers' collection
    await updateDoc(passengerRef, {
      personImage: imageUrl,
    });
    console.log("Passenger image updated successfully");
  } catch (error) {
    console.error("Error updating passenger image:", error);
  }
};

const storage = getFirestore(app);

export { storage };
// ✅ Function to save passenger details
export const savePassengerDetails = async (passengerData) => {
  try {
    await addDoc(collection(db, "passengers"), passengerData);
    console.log("Passenger data saved successfully!");
  } catch (error) {
    console.error("Error saving passenger data: ", error);
  }
};

// ✅ Function to get passenger details by barcode
export const getPassengerDetailsById = async (identificationNo) => {
  try {
    const q = query(
      collection(db, "passengers"),
      where("identificationNo", "==", identificationNo)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching passenger data: ", error);
    throw error;
  }
};
