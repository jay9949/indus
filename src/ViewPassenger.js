import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getPassengerByIdentificationNo,
  updatePassengerPersonImage,
} from "./firebaseService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseService";
import { v4 as uuidv4 } from "uuid";

const ViewPassenger = () => {
  const [searchParams] = useSearchParams();
  const [passengerData, setPassengerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const barcode = searchParams.get("barcode");

  useEffect(() => {
    const fetchData = async () => {
      if (!barcode) return;
      try {
        const data = await getPassengerByIdentificationNo(barcode);
        setPassengerData(data);
      } catch (error) {
        console.error("Error fetching passenger:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [barcode]);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      console.error("No image file selected");
      return;
    }

    try {
      // Optional: Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(imageFile.type)) {
        console.error("Unsupported file type");
        return;
      }

      const fileExtension = imageFile.name.split(".").pop();
      const uniqueFileName = `image_${uuidv4()}.${fileExtension}`;
      const imageRef = ref(storage, `images/${uniqueFileName}`);

      const snapshot = await uploadBytes(imageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log("Image uploaded. Download URL:", downloadURL);

      await updatePassengerPersonImage(barcode, downloadURL);
      console.log("Passenger image updated in database.");

      const updatedData = await getPassengerByIdentificationNo(barcode);
      setPassengerData(updatedData);
      setImageUrl(downloadURL);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!passengerData) {
    return (
      <div className="text-center mt-10 text-red-500">Passenger not found.</div>
    );
  }

  const fieldsOrder = [
    { key: "name", label: "Name" },
    { key: "flightNo", label: "Flight No" },
    { key: "pnr", label: "PNR" },
    { key: "seatNo", label: "Seat Number" },
    { key: "noOfBaggage", label: "No. of Baggage" },
    { key: "baggageWeight", label: "Baggage Weight" },
    { key: "arrivalTime", label: "Arrival Time" },
    { key: "departureTime", label: "Departure Time" },
    { key: "identificationNo", label: "Identification No" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Passenger Details
        </h1>

        <div className="flex flex-col gap-4">
          {fieldsOrder.map(({ key, label }) =>
            passengerData[key] ? (
              <div key={key} className="flex flex-col">
                <span className="text-gray-600">{label}</span>
                <span className="text-gray-800 font-semibold">
                  {passengerData[key]}
                </span>
              </div>
            ) : null
          )}

          {/* Person Image Section */}
          <div className="flex flex-col mt-4">
            <span className="text-gray-600">Person Image</span>
            {passengerData.personImage ? (
              <img
                src={passengerData.personImage}
                alt="Person"
                className="w-[8rem] h-auto max-w-md object-cover mt-2 rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
              />
            ) : (
              <p className="text-sm text-gray-500">
                Person image not available
              </p>
            )}

            <div className="flex flex-col mt-2 gap-2">
              <input type="file" onChange={handleFileChange} />
              <button
                onClick={handleImageUpload}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Upload New Image
              </button>
            </div>
          </div>

          {/* Baggage Images */}
          <div className="flex flex-col mt-4">
            <span className="text-gray-600">Baggage Images</span>
            <div className="flex flex-wrap gap-4 mt-2">
              {passengerData.baggageImages?.length > 0 ? (
                passengerData.baggageImages.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`Baggage ${idx + 1}`}
                    className="w-32 h-32 object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-baggage.png";
                    }}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No baggage images available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPassenger;
