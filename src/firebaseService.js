// // firebaseService.js
// import { db } from "./firebaseConfig";
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, addDoc } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyCIMjEGI-HayQ_qq53XQvVGvjAwt9k-1Wo",
//   authDomain: "indus-54d6c.firebaseapp.com",
//   projectId: "indus-54d6c",
//   storageBucket: "indus-54d6c.firebasestorage.app",
//   messagingSenderId: "894162220283",
//   appId: "1:894162220283:web:ef3f6a22a343f3cde22c5e",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Function to save passenger details to Firebase
// export const savePassengerDetails = async (passengerData) => {
//   try {
//     // Save the passenger details into the 'passengers' collection
//     await addDoc(collection(db, "passengers"), passengerData);
//     console.log("Passenger data saved successfully!");
//   } catch (error) {
//     console.error("Error saving passenger data: ", error);
//   }
// };

// export const getPassengerDetailsById = async (identificationNo) => {
//   const q = query(
//     collection(db, "passengers"),
//     where("identificationNo", "==", identificationNo)
//   );
//   const querySnapshot = await getDocs(q);

//   if (!querySnapshot.empty) {
//     return querySnapshot.docs[0].data();
//   } else {
//     return null;
//   }
// };

// firebaseService.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCIMjEGI-HayQ_qq53XQvVGvjAwt9k-1Wo",
  authDomain: "indus-54d6c.firebaseapp.com",
  projectId: "indus-54d6c",
  storageBucket: "indus-54d6c.appspot.com",
  messagingSenderId: "894162220283",
  appId: "1:894162220283:web:ef3f6a22a343f3cde22c5e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { storage };

export const getPassengerByIdentificationNo = async (identificationNo) => {
  const passengersRef = collection(db, "passengers");
  const q = query(
    passengersRef,
    where("identificationNo", "==", identificationNo)
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  return querySnapshot.docs[0].data();
};

export const updatePassengerPersonImage = async (barcode, imageUrl) => {
  try {
    const q = query(
      collection(db, "passengers"),
      where("identificationNo", "==", barcode)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, { personImage: imageUrl });
      console.log("Passenger image updated successfully");
    } else {
      console.log("Passenger not found for update");
    }
  } catch (error) {
    console.error("Error updating passenger image:", error);
  }
};

export const savePassengerDetails = async (passengerData) => {
  try {
    await addDoc(collection(db, "passengers"), passengerData);
    console.log("Passenger data saved successfully!");
  } catch (error) {
    console.error("Error saving passenger data: ", error);
  }
};

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
