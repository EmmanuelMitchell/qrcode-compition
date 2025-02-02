

// import React, { useState } from "react";

// function PhoneForm({ shopId, onSubmit }) {
//   const [phoneNumber, setPhoneNumber] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (phoneNumber.trim()) {
//       onSubmit(phoneNumber.trim());
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
//         <h2 className="text-2xl font-bold mb-4">Enter Your Phone Number</h2>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="tel"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//             placeholder="Enter phone number"
//             className="w-full p-2 border border-gray-300 rounded mb-4"
//             required
//           />
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
//           >
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default PhoneForm;
