// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import PhoneForm from './PhoneForm';
// import { api } from '../utils/api';

// function Scanner() {
//   const { shopId } = useParams();
//   const [showForm, setShowForm] = useState(true);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Validate the shop ID format
//     const isValidFormat = /^[a-z]+-(?:android|iphone)$/.test(shopId);
//     if (!isValidFormat) {
//       setError('Invalid shop format');
//       setLoading(false);
//       return;
//     }

//     setLoading(false);
//   }, [shopId]);

//   const handlePhoneSubmit = async (phoneNumber) => {
//     try {
//       setError(null);
//       const { redirectUrl } = await api.recordScan(shopId, phoneNumber);
//       window.location.href = redirectUrl;
//     } catch (error) {
//       setError('Failed to record scan. Please try again.');
//       console.error('Scan error:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-xl text-gray-600">Loading...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-xl text-red-600">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       {showForm && (
//         <PhoneForm
//           shopId={shopId}
//           onSubmit={handlePhoneSubmit}
//         />
//       )}
//     </div>
//   );
// }

// export default Scanner;



import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import PhoneForm from "./PhoneForm";
import { api } from "../utils/api";
import PhoneForm from "./PhoneForm";

function Scanner() {
  const { shopId } = useParams();
  const [showForm, setShowForm] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shopId) {
      setError("Shop ID is missing.");
      setLoading(false);
      return;
    }

    const isValidFormat = /^[a-z]+-(?:android|iphone)$/.test(shopId);
    if (!isValidFormat) {
      setError("Invalid shop format.");
      setLoading(false);
      return;
    }

    setLoading(false);
    setShowForm(false)
  }, [shopId]);

  const handlePhoneSubmit = async (phoneNumber) => {
    setShowForm(false)
    try {
      setError(null);
      setShowForm(false); // Hide form after submission
      const { redirectUrl } = await api.recordScan(shopId, phoneNumber);
      window.location.href = redirectUrl; // Redirect to App Store or Play Store
    } catch (error) {
      setError("Failed to record scan. Please try again.");
      setShowForm(true); // Show form again if an error occurs
      console.error("Scan error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {showForm && <PhoneForm shopId={shopId} onSubmit={handlePhoneSubmit} />}
    </div>
  );
}

export default Scanner;
