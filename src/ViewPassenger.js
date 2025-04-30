import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getPassengerByIdentificationNo,
  updatePassengerPersonImage,
} from "./firebaseService"; // Firebase service functions
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseService"; // Firebase config

const ViewPassenger = () => {
  const [searchParams] = useSearchParams();
  const [passengerData, setPassengerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const barcode = searchParams.get("barcode");

  const formFieldOrder = [
    { key: "name", label: "Name" },
    { key: "flightNo", label: "Flight No" },
    { key: "pnr", label: "PNR" },
    { key: "seatNo", label: "Seat No" },
    { key: "noOfBaggage", label: "No of Baggage" },
    { key: "baggageWeight", label: "Baggage Weight" },
    { key: "departurePlace", label: "Departure Place" },
    { key: "arrivalPlace", label: "Arrival Place" },
    { key: "departureTime", label: "Departure Time" },
    { key: "arrivalTime", label: "Arrival Time" },
    { key: "identificationNo", label: "Identification No" },
  ];

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
    if (!imageFile) return;
    const imageRef = ref(storage, `images/${imageFile.name}`);
    try {
      const snapshot = await uploadBytes(imageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref());
      setImageUrl(downloadURL);

      // Save uploaded image URL into the passenger database
      await updatePassengerPersonImage(barcode, downloadURL);

      // Refresh passenger data to show the new image
      const updatedData = await getPassengerByIdentificationNo(barcode);
      setPassengerData(updatedData);
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Passenger Details
        </h1>

        <div className="flex flex-col gap-4">
          {/* Display Form Fields in Order */}
          {formFieldOrder.map(({ key, label }) => (
            <div key={key} className="flex flex-col">
              <span className="text-gray-600">{label}</span>
              <span className="text-gray-800 font-semibold">
                {passengerData[key] || "-"}
              </span>
            </div>
          ))}

          {/* Person Image Section */}
          <div className="flex flex-col mt-4">
            <span className="text-gray-600">Person Image</span>
            {passengerData.personImage ? (
              <img
                src={passengerData.personImage}
                alt="Person"
                className="w-full h-auto max-w-md object-cover mt-2 rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png"; // fallback image
                }}
              />
            ) : (
              <p className="text-sm text-gray-500">
                Person image not available
              </p>
            )}
          </div>

          {/* Baggage Images Section */}
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
