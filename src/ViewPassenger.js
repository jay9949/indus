// import React, { useEffect, useState } from "react";
// import { getPassengerDetailsById } from "./firebaseService"; // We'll add this function
// import { useLocation } from "react-router";

// const ViewPassenger = () => {
//   const [passenger, setPassenger] = useState(null);
//   const [error, setError] = useState("");
//   const location = useLocation();

//   // Helper to read URL parameters
//   const getQueryParam = (key) => {
//     return new URLSearchParams(location.search).get(key);
//   };

//   useEffect(() => {
//     const barcode = getQueryParam("barcode");
//     if (barcode) {
//       fetchPassenger(barcode);
//     } else {
//       setError("No barcode found in URL!");
//     }
//   }, [location]);

//   const fetchPassenger = async (barcode) => {
//     try {
//       const data = await getPassengerDetailsById(barcode);
//       if (data) {
//         setPassenger(data);
//       } else {
//         setError("No passenger found for this barcode!");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Error fetching passenger data.");
//     }
//   };

//   if (error) {
//     return <div className="p-6 text-red-500">{error}</div>;
//   }

//   if (!passenger) {
//     return <div className="p-6">Loading passenger details...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
//         <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
//           Passenger Details
//         </h1>

//         <div className="flex flex-col gap-4">
//           {Object.entries(passenger).map(([key, value]) => {
//             if (key === "personImage") {
//               return (
//                 <div key={key} className="flex flex-col items-center">
//                   <h2 className="font-semibold">
//                     {key.replace(/([A-Z])/g, " $1")}
//                   </h2>
//                   <img
//                     src={value}
//                     alt="Person"
//                     className="w-32 h-32 object-cover rounded"
//                   />
//                 </div>
//               );
//             } else if (key === "baggageImages") {
//               return (
//                 <div key={key} className="flex flex-col items-center">
//                   <h2 className="font-semibold">
//                     {key.replace(/([A-Z])/g, " $1")}
//                   </h2>
//                   <div className="flex flex-wrap gap-4 mt-2">
//                     {value.map((img, index) => (
//                       <img
//                         key={index}
//                         src={img}
//                         alt={`Baggage ${index + 1}`}
//                         className="w-24 h-24 object-cover rounded"
//                       />
//                     ))}
//                   </div>
//                 </div>
//               );
//             } else {
//               return (
//                 <div key={key} className="flex flex-col">
//                   <span className="text-gray-600 capitalize">
//                     {key.replace(/([A-Z])/g, " $1")}
//                   </span>
//                   <span className="text-gray-900">{value}</span>
//                 </div>
//               );
//             }
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewPassenger;

// import React, { useEffect, useState } from "react";
// import { getPassengerDetailsById } from "./firebaseService"; // Make sure this is correct

// const ViewPassenger = () => {
//   const [passenger, setPassenger] = useState(null);
//   const [error, setError] = useState("");

//   // Helper to read URL parameters from window.location
//   const getQueryParam = (key) => {
//     return new URLSearchParams(window.location.search).get(key);
//   };

//   useEffect(() => {
//     const barcode = getQueryParam("barcode");
//     if (barcode) {
//       fetchPassenger(barcode);
//     } else {
//       setError("No barcode found in URL!");
//     }
//   }, []); // empty dependency array (only run once)

//   const fetchPassenger = async (barcode) => {
//     try {
//       const data = await getPassengerDetailsById(barcode);
//       if (data) {
//         setPassenger(data);
//       } else {
//         setError("No passenger found for this barcode!");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Error fetching passenger data.");
//     }
//   };

//   if (error) {
//     return <div className="p-6 text-red-500">{error}</div>;
//   }

//   if (!passenger) {
//     return <div className="p-6">Loading passenger details...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
//         <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
//           Passenger Details
//         </h1>

//         <div className="flex flex-col gap-4">
//           {Object.entries(passenger).map(([key, value]) => {
//             if (key === "personImage") {
//               return (
//                 <div key={key} className="flex flex-col items-center">
//                   <h2 className="font-semibold">
//                     {key.replace(/([A-Z])/g, " $1")}
//                   </h2>
//                   <img
//                     src={value}
//                     alt="Person"
//                     className="w-32 h-32 object-cover rounded"
//                   />
//                 </div>
//               );
//             } else if (key === "baggageImages") {
//               return (
//                 <div key={key} className="flex flex-col items-center">
//                   <h2 className="font-semibold">
//                     {key.replace(/([A-Z])/g, " $1")}
//                   </h2>
//                   <div className="flex flex-wrap gap-4 mt-2">
//                     {value.map((img, index) => (
//                       <img
//                         key={index}
//                         src={img}
//                         alt={`Baggage ${index + 1}`}
//                         className="w-24 h-24 object-cover rounded"
//                       />
//                     ))}
//                   </div>
//                 </div>
//               );
//             } else {
//               return (
//                 <div key={key} className="flex flex-col">
//                   <span className="text-gray-600 capitalize">
//                     {key.replace(/([A-Z])/g, " $1")}
//                   </span>
//                   <span className="text-gray-900">{value}</span>
//                 </div>
//               );
//             }
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewPassenger;

// import React, { useEffect, useState } from "react";
// import { getPassengerDetailsById } from "./firebaseService";

// // Move helper function OUTSIDE the component
// const getQueryParam = (key) => {
//   return new URLSearchParams(window.location.search).get(key);
// };

// const ViewPassenger = () => {
//   const [passenger, setPassenger] = useState(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const barcode = getQueryParam("barcode");
//     if (barcode) {
//       fetchPassenger(barcode);
//     } else {
//       setError("No barcode found in URL!");
//     }
//   }, []); // ✅ No warning now

//   const fetchPassenger = async (barcode) => {
//     try {
//       const data = await getPassengerDetailsById(barcode);
//       if (data) {
//         setPassenger(data);
//       } else {
//         setError("No passenger found for this barcode!");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Error fetching passenger data.");
//     }
//   };

//   if (error) {
//     return <div className="p-6 text-red-500">{error}</div>;
//   }

//   if (!passenger) {
//     return <div className="p-6">Loading passenger details...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
//         <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
//           Passenger Details
//         </h1>

//         <div className="flex flex-col gap-4">
//           {Object.entries(passenger).map(([key, value]) => {
//             if (key === "personImage") {
//               return (
//                 <div key={key} className="flex flex-col items-center">
//                   <h2 className="font-semibold">
//                     {key.replace(/([A-Z])/g, " $1")}
//                   </h2>
//                   <img
//                     src={value}
//                     alt="Person"
//                     className="w-32 h-32 object-cover rounded"
//                   />
//                 </div>
//               );
//             } else if (key === "baggageImages") {
//               return (
//                 <div key={key} className="flex flex-col items-center">
//                   <h2 className="font-semibold">
//                     {key.replace(/([A-Z])/g, " $1")}
//                   </h2>
//                   <div className="flex flex-wrap gap-4 mt-2">
//                     {value.map((img, index) => (
//                       <img
//                         key={index}
//                         src={img}
//                         alt={`Baggage ${index + 1}`}
//                         className="w-24 h-24 object-cover rounded"
//                       />
//                     ))}
//                   </div>
//                 </div>
//               );
//             } else {
//               return (
//                 <div key={key} className="flex flex-col">
//                   <span className="text-gray-600 capitalize">
//                     {key.replace(/([A-Z])/g, " $1")}
//                   </span>
//                   <span className="text-gray-900">{value}</span>
//                 </div>
//               );
//             }
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewPassenger;

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
      <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Passenger Details
        </h1>

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
