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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIMjEGI-HayQ_qprjQ9k-1Wo",
  authDomain: "indus-54d6c.firebaseapp.com",
  projectId: "indus-54d6c",
  storageBucket: "indus-54d6c.appspot.com",
  messagingSenderId: "894162220283",
  appId: "1:894162220283:web:ef3f6a22a343f3cde22c5e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Function to fix Blob URLs in the database
export const fixBlobUrls = async (placeholderImageUrl = null) => {
  try {
    const passengersRef = collection(db, "passengers");
    const snapshot = await getDocs(passengersRef);

    for (const document of snapshot.docs) {
      const data = document.data();
      if (data.personImage && data.personImage.startsWith("blob:")) {
        console.log(`Found invalid blob URL for ${document.id}: ${data.personImage}`);
        // If no original file is available, set to placeholder or null
        await updateDoc(document.ref, {
          personImage: placeholderImageUrl || null,
        });
        console.log(`Updated personImage for ${document.id} to ${placeholderImageUrl || "null"}`);
      }
    }
    console.log("Blob URL fixing completed.");
  } catch (error) {
    console.error("Error fixing blob URLs:", error);
    throw error;
  }
};

// Function to get passenger by identification number
export const getPassengerByIdentificationNo = async (identificationNo) => {
  try {
    const passengersRef = collection(db, "passengers");
    const q = query(passengersRef, where("identificationNo", "==", identificationNo));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    // Warn if multiple documents are found (data inconsistency)
    if (querySnapshot.size > 1) {
      console.warn(`Multiple passengers found for identificationNo: ${identificationNo}`);
    }

    return querySnapshot.docs[0].data();
  } catch (error) {
    console.error("Error fetching passenger:", error);
    throw error;
  }
};

// Function to update passenger person image
export const updatePassengerPersonImage = async (identificationNo, imageUrl) => {
  try {
    // Query to find the passenger by identificationNo
    const passengersRef = collection(db, "passengers");
    const q = query(passengersRef, where("identificationNo", "==", identificationNo));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error(`No passenger found with identificationNo: ${identificationNo}`);
    }

    const passengerDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, "passengers", passengerDoc.id), {
      personImage: imageUrl,
    });
    console.log(`Passenger image updated for identificationNo: ${identificationNo}`);
  } catch (error) {
    console.error("Error updating passenger image:", error);
    throw error;
  }
};

// Function to save passenger details
export const savePassengerDetails = async (passengerData) => {
  try {
    await addDoc(collection(db, "passengers"), passengerData);
    console.log("Passenger data saved successfully!");
  } catch (error) {
    console.error("Error saving passenger data:", error);
    throw error;
  }
};

// Function to get passenger details by identification number (duplicate of getPassengerByIdentificationNo)
export const getPassengerDetailsById = async (identificationNo) => {
  try {
    const q = query(
      collection(db, "passengers"),
      where("identificationNo", "==", identificationNo)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    // Warn if multiple documents are found
    if (querySnapshot.size > 1) {
      console.warn(`Multiple passengers found for identificationNo: ${identificationNo}`);
    }

    return querySnapshot.docs[0].data();
  } catch (error) {
    console.error("Error fetching passenger data:", error);
    throw error;
  }
};

// Function to upload an image to Firebase Storage
export const uploadImageToFirebase = async (file) => {
  try {
    const storageRef = ref(storage, `passenger-images/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    console.log("Image uploaded successfully:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
