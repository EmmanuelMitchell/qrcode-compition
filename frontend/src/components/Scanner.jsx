
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import PhoneForm from "./PhoneForm";
// import { API_BASE_URL } from "../utils/api";
// import { shops } from "../data/shops";

// function Scanner() {
//   const { shopId } = useParams();
//   const navigate = useNavigate();
//   const [showForm, setShowForm] = useState(true);
//   const [scanCount, setScanCount] = useState(0);

//   const shop = shops.find((s) => s.id === shopId);

//   useEffect(() => {
//     // Track scan count in localStorage
//     const count = localStorage.getItem(`scanCount-${shopId}`) || 0;
//     setScanCount(Number(count) + 1);
//     localStorage.setItem(`scanCount-${shopId}`, Number(count) + 1);
//   }, [shopId]);

//   if (!shop) {
//     return <div>Invalid shop ID</div>;
//   }

//   const handlePhoneSubmit = async (phoneNumber) => {
//     try {
//       // Store phone number in local storage
//       localStorage.setItem("phoneNumber", phoneNumber);

//       // Send scan data to backend
//       await fetch(`https://qrcode-compition.onrender.com/api/scans`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           shopId,
//           phoneNumber,
//           scanCount,
//         }),
//       });

//       // Redirect user to store
//       window.location.href = shop.url;
//     } catch (error) {
//       console.error("Failed to record scan:", error);
//       window.location.href = shop.url; // Redirect even if there's an error
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       {showForm && <PhoneForm shopId={shopId} onSubmit={handlePhoneSubmit} />}
//     </div>
//   );
// }

// export default Scanner;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { shops } from "../data/shops";

function Scanner() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");

  const shop = shops.find((s) => s.id === shopId);

  useEffect(() => {
    console.log("Scanner component loaded");

    // Check if shop exists
    if (!shop) {
      console.error("Invalid shop ID:", shopId);
      return;
    }
    //  alert("Tre")
    // Ensure the form is visible
    setShowForm(true);
    console.log("Form should be visible:", showForm);

    // Track scan count in localStorage
    const count = parseInt(localStorage.getItem(`scanCount-${shopId}`)) || 0;
    const newCount = count + 1;
    setScanCount(newCount);
    localStorage.setItem(`scanCount-${shopId}`, newCount);

    console.log("Scan count:", newCount);
  }, [shopId]);

  if (!shop) {
    return <div>Invalid shop ID</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      alert("Please enter a valid phone number.");
      return;
    }

    try {
      localStorage.setItem("phoneNumber", phoneNumber.trim());

      // Send scan data to backend
      await fetch(`https://qrcode-compition.onrender.com/api/scans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          phoneNumber: phoneNumber.trim(),
          scanCount,
        }),
      });

      console.log("Scan recorded successfully");

      // Redirect user to store
      window.location.href = shop.url;
    } catch (error) {
      console.error("Failed to record scan:", error);
      window.location.href = shop.url; // Redirect even if there's an error
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {!showForm ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Enter Your Phone Number</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : (
        <p className="text-center text-lg font-bold">Redirecting to Play Store...</p>
      )}
    </div>
  );
}

export default Scanner;
