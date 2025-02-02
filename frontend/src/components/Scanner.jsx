// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import PhoneForm from './PhoneForm';
// import { api } from '../utils/api';

// function Scanner() {
//   const { shopId } = useParams();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Validate the shop ID format
//     const isValidFormat = /^[a-z]+-(?:android|iphone)$/.test(shopId);
//     if (!isValidFormat) {
//       setError('Invalid shop format');
//     }
//     setLoading(false);
//   }, [shopId]);

//   const handlePhoneSubmit = async (phoneNumber) => {
//     try {
//       setIsSubmitting(true);
//       setError(null);
//       const { redirectUrl } = await api.recordScan(shopId, phoneNumber);
//       window.location.href = redirectUrl;
//     } catch (error) {
//       setError('Failed to record scan. Please try again.');
//       console.error('Scan error:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-xl text-gray-600">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <PhoneForm
//         shopId={shopId}
//         onSubmit={handlePhoneSubmit}
//         error={error}
//         isSubmitting={isSubmitting}
//       />
//     </div>
//   );
// }

// export default Scanner



// import React, { useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import PhoneForm from './PhoneForm';
// import { API_BASE_URL } from '../utils/api';
// import { shops } from '../data/shops';
// function Scanner() {
//   const { shopId } = useParams();
//   const navigate = useNavigate();
//   const [showForm, setShowForm] = useState(true);

//   const shop = shops.find(s => s.id === shopId);

//   if (!shop) {
//     return <div>Invalid shop ID</div>;
//   }

//   const handlePhoneSubmit = async (phoneNumber) => {
//     try {
//       await fetch(`${API_BASE_URL}/api/scans`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           shopId,
//           phoneNumber
//         }),
//       });
      
//       // Redirect to store
//       window.location.href = shop.url;
//     } catch (error) {
//       console.error('Failed to record scan:', error);
//       // Still redirect even if there's an error
//       window.location.href = shop.url;
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
import PhoneForm from "./PhoneForm";
import { API_BASE_URL } from "../utils/api";
import { shops } from "../data/shops";

function Scanner() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(true);
  const [scanCount, setScanCount] = useState(0);

  const shop = shops.find((s) => s.id === shopId);

  useEffect(() => {
    // Track scan count in localStorage
    const count = localStorage.getItem(`scanCount-${shopId}`) || 0;
    setScanCount(Number(count) + 1);
    localStorage.setItem(`scanCount-${shopId}`, Number(count) + 1);
  }, [shopId]);

  if (!shop) {
    return <div>Invalid shop ID</div>;
  }

  const handlePhoneSubmit = async (phoneNumber) => {
    try {
      // Store phone number in local storage
      localStorage.setItem("phoneNumber", phoneNumber);

      // Send scan data to backend
      await fetch(`${API_BASE_URL}/api/scans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopId,
          phoneNumber,
          scanCount,
        }),
      });

      // Redirect user to store
      window.location.href = shop.url;
    } catch (error) {
      console.error("Failed to record scan:", error);
      window.location.href = shop.url; // Redirect even if there's an error
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {showForm && <PhoneForm shopId={shopId} onSubmit={handlePhoneSubmit} />}
    </div>
  );
}

export default Scanner;
