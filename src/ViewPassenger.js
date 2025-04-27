import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPassengerByIdentificationNo } from "./firebaseService";

const ViewPassenger = () => {
  const [searchParams] = useSearchParams();
  const [passengerData, setPassengerData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!passengerData) {
    return (
      <div className="text-center mt-10 text-red-500">Passenger not found.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Updated Header */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Passenger Details
        </h1>
        <p className="text-center text-gray-600">
          View detailed information about the passenger.
        </p>
      </div>

      <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
        <div className="flex flex-col gap-4">
          {Object.entries(passengerData).map(([key, value]) => {
            if (key === "personImage" || key === "baggageImages") return null;
            return (
              <div key={key} className="flex flex-col">
                <span className="text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <span className="text-gray-800 font-semibold">{value}</span>
              </div>
            );
          })}

          <div className="flex flex-col mt-4">
            <span className="text-gray-600">Person Image</span>
            <img
              src={passengerData.personImage}
              alt="Person"
              className="w-40 h-40 object-cover mt-2 rounded"
            />
          </div>

          <div className="flex flex-col mt-4">
            <span className="text-gray-600">Baggage Images</span>
            <div className="flex flex-wrap gap-4 mt-2">
              {passengerData.baggageImages?.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`Baggage ${idx + 1}`}
                  className="w-32 h-32 object-cover rounded"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPassenger;
