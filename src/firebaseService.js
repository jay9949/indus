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

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCIMjEGI-HayQ_qq53XQvVGvjAwt9k-1Wo",
  authDomain: "indus-54d6c.firebaseapp.com",
  projectId: "indus-54d6c",
  storageBucket: "indus-54d6c.appspot.com", // ❗ Corrected from .appspot.com
  messagingSenderId: "894162220283",
  appId: "1:894162220283:web:ef3f6a22a343f3cde22c5e",
};

// ✅ Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Function to get passenger data by identification number
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

// ✅ Function to update passenger's person image
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

// ✅ Function to update passenger's baggage images
export const updatePassengerBaggageImages = async (
  barcode,
  baggageImageUrls
) => {
  try {
    const passengerRef = doc(db, "passengers", barcode); // Assuming 'passengers' collection
    await updateDoc(passengerRef, {
      baggageImages: baggageImageUrls, // Updating the baggageImages field
    });
    console.log("Passenger baggage images updated successfully");
  } catch (error) {
    console.error("Error updating passenger baggage images:", error);
  }
};

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

const storage = getFirestore(app);

export { storage };
