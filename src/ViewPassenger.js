import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getPassengerByIdentificationNo,
  updatePassengerPersonImage,
  updatePassengerBaggageImages,
} from "./firebaseService";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseService";
import { v4 as uuidv4 } from "uuid";

const ViewPassenger = () => {
  const [searchParams] = useSearchParams();
  const [passengerData, setPassengerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [baggageImages, setBaggageImages] = useState([]);
  const [baggageImageFiles, setBaggageImageFiles] = useState([]);

  const barcode = searchParams.get("barcode");

  // Fetch passenger data using barcode
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

  // Clean up blob preview
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleBaggageFileChange = (e) => {
    const files = Array.from(e.target.files);
    setBaggageImageFiles(files);

    // Preview the selected baggage images
    const previews = files.map((file) => URL.createObjectURL(file));
    setBaggageImages(previews);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    try {
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

      await updatePassengerPersonImage(barcode, downloadURL);

      const updatedData = await getPassengerByIdentificationNo(barcode);
      setPassengerData(updatedData);

      setPreviewUrl(null);
      setImageFile(null);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleBaggageUpload = async () => {
    if (baggageImageFiles.length === 0) return;

    try {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      const validFiles = baggageImageFiles.filter((file) =>
        validTypes.includes(file.type)
      );

      if (validFiles.length === 0) {
        console.error("No valid baggage images selected");
        return;
      }

      const uploadPromises = validFiles.map((file) => {
        const fileExtension = file.name.split(".").pop();
        const uniqueFileName = `baggage_${uuidv4()}.${fileExtension}`;
        const baggageRef = ref(storage, `baggage_images/${uniqueFileName}`);

        return uploadBytes(baggageRef, file).then((snapshot) =>
          getDownloadURL(snapshot.ref)
        );
      });

      const downloadURLs = await Promise.all(uploadPromises);

      // Update the passenger's baggage images array with the new URLs
      await updatePassengerBaggageImages(barcode, downloadURLs);

      const updatedData = await getPassengerByIdentificationNo(barcode);
      setPassengerData(updatedData);

      setBaggageImages([]);
      setBaggageImageFiles([]);
    } catch (error) {
      console.error("Error uploading baggage images:", error);
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
          {/* Text Fields */}
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
            {passengerData?.personImage ? (
              <img
                src={passengerData.personImage}
                alt="Person"
                className="w-[8rem] h-auto object-cover mt-2 rounded border"
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
          </div>

          {/* Baggage Images Section */}
          <div className="flex flex-col mt-4">
            <span className="text-gray-600">Baggage Images</span>
            <div className="flex flex-wrap gap-4 mt-2">
              {passengerData?.baggageImages?.length > 0 ? (
                passengerData.baggageImages.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`Baggage ${idx + 1}`}
                    className="w-32 h-32 object-cover rounded border"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-baggage.png";
                    }}
                  />
                ))
              ) : (
                <p>No baggage images available</p>
              )}
            </div>

            {/* Baggage Image Upload */}
            <div className="flex flex-col mt-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleBaggageFileChange}
              />
              <button
                onClick={handleBaggageUpload}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2"
              >
                Upload Baggage Images
              </button>
            </div>

            {/* Preview for Baggage Images */}
            {baggageImages.length > 0 && (
              <div className="flex gap-4 mt-4">
                {baggageImages.map((previewUrl, idx) => (
                  <img
                    key={idx}
                    src={previewUrl}
                    alt={`Baggage Preview ${idx + 1}`}
                    className="w-32 h-32 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPassenger;
