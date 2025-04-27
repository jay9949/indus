import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPassengerByIdentificationNo } from "./firebaseService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseService"; // Your firebaseConfig file

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
    if (!imageFile) return;
    const imageRef = ref(storage, `images/${imageFile.name}`);
    try {
      const snapshot = await uploadBytes(imageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref());
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Passenger Details
        </h1>

        <div className="flex flex-col gap-4">
          {/* Displaying the fields line by line */}
          <div className="flex flex-col">
            <span className="text-gray-600">Name</span>
            <span className="text-gray-800 font-semibold">
              {passengerData.name}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600">Flight No</span>
            <span className="text-gray-800 font-semibold">
              {passengerData.flightNo}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600">PNR</span>
            <span className="text-gray-800 font-semibold">
              {passengerData.pnr}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600">Seat No</span>
            <span className="text-gray-800 font-semibold">
              {passengerData.seatNo}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600">No of Baggage</span>
            <span className="text-gray-800 font-semibold">
              {passengerData.noOfBaggage}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600">Baggage Weight</span>
            <span className="text-gray-800 font-semibold">
              {passengerData.baggageWeight}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600">Arrival Time</span>
            <span className="text-gray-800 font-semibold">
              {passengerData.arrivalTime}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600">Departure Time</span>
            <span className="text-gray-800 font-semibold">
              {passengerData.departureTime}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600">Identification No</span>
            <span className="text-gray-800 font-semibold">
              {passengerData.identificationNo}
            </span>
          </div>

          {/* Person Image */}
          <div className="flex flex-col mt-4">
            <span className="text-gray-600">Person Image</span>
            {passengerData.personImage ? (
              <img
                src={passengerData.personImage}
                alt="Person"
                className="w-full h-auto max-w-md object-cover mt-2 rounded"
                onError={() =>
                  console.error("Image not found:", passengerData.personImage)
                }
              />
            ) : (
              <p className="text-sm text-gray-500">
                Person image not available
              </p>
            )}
          </div>

          {/* Baggage Images */}
          <div className="flex flex-col mt-4">
            <span className="text-gray-600">Baggage Images</span>
            <div className="flex flex-wrap gap-4 mt-2">
              {passengerData.baggageImages?.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`Baggage ${idx + 1}`}
                  className="w-32 h-32 object-cover rounded"
                  onError={() => console.error("Image not found:", imgUrl)}
                />
              ))}
            </div>
            {passengerData.baggageImages?.length === 0 && (
              <p className="text-sm text-gray-500">
                No baggage images available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPassenger;
