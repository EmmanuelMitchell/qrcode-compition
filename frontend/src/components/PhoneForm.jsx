// import  { useState } from 'react';

// export default function PhoneForm  ({ shopId, onSubmit })  {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [isValid, setIsValid] = useState(true);

//   const validatePhoneNumber = (number) => {
//     // Basic phone number validation (adjust regex as needed)
//     const phoneRegex = /^\+?[0-9]{10,14}$/;
//     return phoneRegex.test(number.replace(/\s+/g, ''));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const cleanNumber = phoneNumber.replace(/\s+/g, '');
    
//     if (validatePhoneNumber(cleanNumber)) {
//       setIsValid(true);
//       onSubmit(cleanNumber);
//     } else {
//       setIsValid(false);
//     }
//   };

//   const getPlatformText = () => {
//     if (shopId.endsWith('-android')) {
//       return 'Play Store';
//     } else if (shopId.endsWith('-iphone')) {
//       return 'App Store';
//     }
//     return 'store';
//   };

//     const getShopName = () => {
//     // Extract shop name from shopId (e.g., "bo-android" -> "Bo")
//     const name = shopId.split('-')[0];
//     return name.charAt(0).toUpperCase() + name.slice(1);
//   };

//   return (
//     <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
//       <div className="text-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-900">
//           Download {getShopName()}
//         </h2>
//         <p className="text-gray-600 mt-2">
//           Enter your phone number to continue to the {getPlatformText()}
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//             Phone Number
//           </label>
//           <div className="mt-1">
//             <input
//               type="tel"
//               id="phone"
//               name="phone"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//               className={`block w-full rounded-md shadow-sm py-2 px-3 border ${
//                 isValid ? 'border-gray-300' : 'border-red-500'
//               } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//               placeholder="+1234567890"
//             />
//           </div>
//           {!isValid && (
//             <p className="mt-2 text-sm text-red-600">
//               Please enter a valid phone number
//             </p>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//         >
//           Continue to {getPlatformText()}
//         </button>
//       </form>

      
//     </div>
//   );
// };




import React, { useState } from 'react';

function PhoneForm({ shopId, onSubmit }) {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      onSubmit(phoneNumber.trim());
    }
  };

  return (
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
  );
}

export default PhoneForm;