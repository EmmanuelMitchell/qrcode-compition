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

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PhoneForm from './PhoneForm';
import { api } from '../utils/api';

function DebugScanner() {
  const { shopId } = useParams();
  const [showForm, setShowForm] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState({
    currentShopId: null,
    validationPassed: false,
    renderPhase: 'initial'
  });

  useEffect(() => {
    // Debug logging
    console.log('Current shopId:', shopId);
    setDebugInfo(prev => ({ ...prev, currentShopId: shopId }));

    // Validate the shop ID format
    const isValidFormat = /^[a-z]+-(?:android|iphone)$/.test(shopId);
    console.log('Shop ID format valid:', isValidFormat);
    setDebugInfo(prev => ({ ...prev, validationPassed: isValidFormat }));

    if (!isValidFormat) {
      setError('Invalid shop format');
      setLoading(false);
      return;
    }

    setLoading(false);
    setDebugInfo(prev => ({ ...prev, renderPhase: 'ready' }));
  }, [shopId]);

  const handlePhoneSubmit = async (phoneNumber) => {
    try {
      setError(null);
      console.log('Attempting submission with:', { shopId, phoneNumber });
      const { redirectUrl } = await api.recordScan(shopId, phoneNumber);
      window.location.href = redirectUrl;
    } catch (error) {
      setError('Failed to record scan. Please try again.');
      console.error('Scan error:', error);
    }
  };

  // Debug display
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-bold mb-2">Debug Info:</h3>
          <pre className="text-sm">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      {loading && (
        <div className="text-xl text-gray-600">Loading...</div>
      )}

      {error && (
        <div className="text-xl text-red-600">{error}</div>
      )}

      {!loading && !error && showForm && (
        <PhoneForm
          shopId={shopId}
          onSubmit={handlePhoneSubmit}
        />
      )}
    </div>
  );
}

export default DebugScanner;