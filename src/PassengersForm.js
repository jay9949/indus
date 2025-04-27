import React, { useState, useRef } from "react";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image"; // ✅ Import for downloading QR
import { savePassengerDetails } from "./firebaseService";
import img from "../src/img/logo.jpeg";

const PassengerDetails = () => {
  const [passengers, setPassengers] = useState([
    {
      formData: {
        name: "",
        flightNo: "",
        pnr: "",
        seatNo: "",
        noOfBaggage: "1",
        baggageWeight: "",
        arrivalTime: "",
        departureTime: "",
        identificationNo: "",
      },
      personImage: null,
      baggageImages: [],
    },
  ]);

  const [errorMessage, setErrorMessage] = useState("");
  const [barcodeGenerated, setBarcodeGenerated] = useState([]);
  const qrCodeRefs = useRef([]);

  const baseUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://bharat-airline.vercel.app"; // ✅ Your Vercel domain

  const handleChange = (index, e) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index].formData[e.target.name] = e.target.value;
    setPassengers(updatedPassengers);
  };

  const handleImageChange = (index, e, type, baggageIndex = null) => {
    const updatedPassengers = [...passengers];
    if (type === "person") {
      updatedPassengers[index].personImage = URL.createObjectURL(
        e.target.files[0]
      );
    } else {
      if (baggageIndex !== null) {
        updatedPassengers[index].baggageImages[baggageIndex] =
          URL.createObjectURL(e.target.files[0]);
      }
    }
    setPassengers(updatedPassengers);
  };

  const addPassenger = () => {
    setPassengers([
      ...passengers,
      {
        formData: {
          name: "",
          flightNo: "",
          pnr: "",
          seatNo: "",
          noOfBaggage: "1",
          baggageWeight: "",
          arrivalTime: "",
          departureTime: "",
          identificationNo: "",
        },
        personImage: null,
        baggageImages: [],
      },
    ]);
  };

  const removePassenger = (index) => {
    const updatedPassengers = passengers.filter((_, i) => i !== index);
    setPassengers(updatedPassengers);
    setBarcodeGenerated((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (index) => {
    const passenger = passengers[index];
    const fields = Object.keys(passenger.formData);
    for (let field of fields) {
      if (
        !passenger.formData[field] ||
        passenger.formData[field].trim() === ""
      ) {
        setErrorMessage("Please fill in all fields properly.");
        setTimeout(() => setErrorMessage(""), 5000);
        return false;
      }
    }

    if (!passenger.personImage || passenger.baggageImages.length === 0) {
      setErrorMessage("Please upload both person image and baggage images.");
      setTimeout(() => setErrorMessage(""), 5000);
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const saveAndGenerateBarcode = async (index) => {
    if (!validateForm(index)) {
      return;
    }

    const passenger = passengers[index];

    try {
      await savePassengerDetails({
        ...passenger.formData,
        personImage: passenger.personImage,
        baggageImages: passenger.baggageImages,
      });

      if (passenger.formData.identificationNo) {
        alert("Passenger data saved successfully!");
        setBarcodeGenerated((prev) => [
          ...prev,
          passenger.formData.identificationNo,
        ]);
      }
    } catch (error) {
      console.error("Error saving data to Firebase: ", error);
    }
  };

  const handleDownloadQRCode = async (index) => {
    const qrCodeElement = qrCodeRefs.current[index];
    if (!qrCodeElement) return;

    try {
      const dataUrl = await toPng(qrCodeElement);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `Passenger_${index + 1}_QRCode.png`;
      link.click();
    } catch (error) {
      console.error("Failed to download QR code", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex items-center gap-4 p-4 bg-white shadow rounded mb-8">
        <img src={img} alt="Logo" className="w-20 h-20 object-contain" />
        <h1 className="text-2xl font-bold text-gray-800">Bharat Air</h1>
      </header>

      <div className="bg-white p-6 rounded shadow max-w-5xl mx-auto">
        {passengers.map((passenger, index) => (
          <div key={index} className="border-b border-gray-300 pb-6 mb-6">
            <form className="flex flex-col gap-4">
              {Object.entries(passenger.formData).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <label className="text-gray-700 capitalize mb-1 text-left">
                    {key.replace(/([A-Z])/g, " $1")}
                  </label>
                  {key === "arrivalTime" || key === "departureTime" ? (
                    <input
                      type="time"
                      name={key}
                      value={value}
                      onChange={(e) => handleChange(index, e)}
                      className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  ) : key === "baggageWeight" ? (
                    // This is the updated baggage weight input with "kg"
                    <div className="flex items-center">
                      <input
                        type="text"
                        name="baggageWeight"
                        value={value}
                        onChange={(e) => handleChange(index, e)}
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter Baggage Weight"
                      />
                      <span className="ml-2 text-gray-600">kg</span>
                    </div>
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={value}
                      onChange={(e) => handleChange(index, e)}
                      className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder={`Enter ${key.replace(/([A-Z])/g, " $1")}`}
                    />
                  )}
                </div>
              ))}

              <div className="flex flex-col">
                <label className="text-gray-700 mb-1 text-left">
                  Person Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(index, e, "person")}
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {passenger.personImage && (
                  <img
                    src={passenger.personImage}
                    alt="Person"
                    className="mt-2 w-32 h-32 object-cover rounded"
                  />
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 mb-1 text-left">
                  Baggage Image(s)
                </label>
                {[...Array(parseInt(passenger.formData.noOfBaggage) || 1)].map(
                  (_, baggageIndex) => (
                    <div key={baggageIndex} className="mb-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(index, e, "baggage", baggageIndex)
                        }
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      {passenger.baggageImages[baggageIndex] && (
                        <img
                          src={passenger.baggageImages[baggageIndex]}
                          alt={`Baggage ${baggageIndex + 1}`}
                          className="mt-2 w-32 h-32 object-cover rounded"
                        />
                      )}
                    </div>
                  )
                )}
              </div>

              {barcodeGenerated.includes(
                passenger.formData.identificationNo
              ) && (
                <div className="mt-6 flex flex-col items-center">
                  <div
                    ref={(el) => (qrCodeRefs.current[index] = el)}
                    className="bg-white p-4 rounded"
                  >
                    <QRCode
                      value={`${baseUrl}/view?barcode=${passenger.formData.identificationNo}`}
                      size={220}
                    />
                  </div>

                  <button
                    onClick={() => handleDownloadQRCode(index)}
                    type="button"
                    className="mt-4 bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition"
                  >
                    Download QR Code
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => saveAndGenerateBarcode(index)}
                className="bg-green-500 text-white py-1 px-2 rounded text-sm hover:bg-green-600 transition mt-4"
              >
                Save & Generate QR Code
              </button>

              <button
                type="button"
                onClick={() => removePassenger(index)}
                className="bg-red-500 text-white py-1 px-2 rounded text-sm hover:bg-red-600 transition mt-2"
              >
                Remove Passenger
              </button>
            </form>
          </div>
        ))}

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={addPassenger}
            className="bg-gray-500 text-white py-1 px-2 rounded text-sm hover:bg-gray-600 transition"
          >
            Add More Passenger
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 text-red-500 text-center">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default PassengerDetails;
