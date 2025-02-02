import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { shops } from "../data/shops";

function Scanner() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [scanCount, setScanCount] = useState(0);
  
  const shop = shops.find((s) => s.id === shopId);

  useEffect(() => {
    console.log("Scanner component loaded");
    if (!shop) {
      console.error("Invalid shop ID:", shopId);
      return;
    }
    
    const count = parseInt(localStorage.getItem(`scanCount-${shopId}`)) || 0;
    const newCount = count + 1;
    setScanCount(newCount);
    localStorage.setItem(`scanCount-${shopId}`, newCount);
    console.log("Scan count:", newCount);
  }, [shopId, shop]);

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Only allow digits
    if (value === '' || /^\d+$/.test(value)) {
      setPhoneNumber(value);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!/^\d+$/.test(phoneNumber)) {
      setError("Please enter numbers only.");
      return;
    }

    setIsLoading(true);
    
    try {
      localStorage.setItem("phoneNumber", phoneNumber.trim());
      
      const response = await fetch(`https://qrcode-compition.onrender.com/api/scans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          phoneNumber: phoneNumber.trim(),
          scanCount,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        setIsLoading(false);
        return;
      }

      console.log("Scan recorded successfully");
      window.location.href = shop.url;
    } catch (error) {
      console.error("Failed to record scan:", error.message);
      setIsLoading(false);
      window.location.href = shop.url;
    }
  };

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Invalid shop ID</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        <h2 className="text-2xl font-bold mb-6 text-center">Enter Your Phone Number</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="Enter phone number"
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Scanner;