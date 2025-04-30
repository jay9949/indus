import React, { useEffect, useState } from "react";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { useSearchParams } from "react-router-dom";
import img from "../src/img/logo.jpeg";

// Setup Sanity
const client = createClient({
  projectId: "mu1z8cz6",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-04-30",
});
const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source).url();
}

const fieldOrder = [
  "name",
  "flightNo",
  "pnr",
  "seatNo",
  "noOfBaggage",
  "baggageWeight",
  "departurePlace",
  "arrivalPlace",
  "departureTime",
  "arrivalTime",
  "identificationNo",
];

const PassengerView = () => {
  const [searchParams] = useSearchParams();
  const [passenger, setPassenger] = useState(null);
  const [loading, setLoading] = useState(true);
  const identificationNo = searchParams.get("barcode");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "passenger" && identificationNo == $id][0]{
            name, flightNo, pnr, seatNo, noOfBaggage, baggageWeight,
            departurePlace, arrivalPlace, departureTime, arrivalTime, identificationNo,
            personImage, baggageImages
          }`,
          { id: identificationNo }
        );
        setPassenger(data);
      } catch (err) {
        console.error("Error fetching passenger:", err);
      } finally {
        setLoading(false);
      }
    };
    if (identificationNo) fetchData();
  }, [identificationNo]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!passenger)
    return (
      <div className="p-6 text-center text-red-500">
        No passenger found with this QR code.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex items-center gap-4 p-4 bg-white shadow rounded mb-8">
        <img src={img} alt="Logo" className="w-20 h-20 object-contain" />
        <h1 className="text-2xl font-bold text-gray-800">Bharat Air</h1>
      </header>

      <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>

        {fieldOrder.map((key) => (
          <div key={key} className="mb-4">
            <label className="text-gray-500 font-medium block mb-1 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            <div className="p-2 rounded text-gray-800 font-bold">
              {passenger[key]}
            </div>
          </div>
        ))}

        <div className="mb-6">
          <label className="text-gray-700 font-medium block mb-2">
            Person Image
          </label>
          <img
            src={urlFor(passenger.personImage)}
            alt="Person"
            className="w-32 h-32 object-cover rounded"
          />
        </div>

        <div>
          <label className="text-gray-700 font-medium block mb-2">
            Baggage Image(s)
          </label>
          <div className="flex flex-wrap gap-4">
            {passenger.baggageImages?.map((img, i) => (
              <img
                key={i}
                src={urlFor(img)}
                alt={`Baggage ${i + 1}`}
                className="w-32 h-32 object-cover rounded"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerView;
