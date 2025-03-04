import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { shops } from "../data/shops";
// import { API_BASE_URL } from "../utils/api";

function Scanner() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [scanCount, setScanCount] = useState(0);
  const [ipAddress, setIpAddress] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  
  const shop = shops.find((s) => s.id === shopId);

  const validPrefixes = ['072', '073', '074', '075', '076', '078', '079'];

  const getStoreName = (url) => {
    if (url.includes('play.google.com')) return 'Google Play Store';
    if (url.includes('apps.apple.com')) return 'Apple App Store';
    return 'app store';
  };

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

    fetch("https://api64.ipify.org?format=json")
      .then(response => response.json())
      .then(data => setIpAddress(data.ip))
      .catch(error => console.error("Error fetching IP address:", error));
  }, [shopId, shop]);

  const validatePhoneNumber = (number) => {
    if (number.length !== 9) {
      return "Phone number must be exactly 9 digits.";
    }
    
    const prefix = number.substring(0, 3);
    if (!validPrefixes.includes(prefix)) {
      return "Please enter a valid Orange number starting with 072, 073, 074, 075, 076, 078, or 079.";
    }
    
    return "";
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 9) {
      setPhoneNumber(value);
      const validationError = validatePhoneNumber(value);
      setError(validationError);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validatePhoneNumber(phoneNumber);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    
    try {
      localStorage.setItem("phoneNumber", phoneNumber.trim());
      
      const response = await fetch("https://qrcode-compition-back.vercel.app/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          phoneNumber,
        }),
      });

      const data = await response.json();
      console.log("post data", data)

      if (!data.success) {
        setError(data.message);
        setIsLoading(false);
        return;
      }

      console.log("Scan recorded successfully");
      setRedirecting(true);
      setTimeout(() => {
        window.location.href = shop.url;
      }, 2000);
    } catch (error) {
      console.error("Failed to record scan:", error.message);
      setIsLoading(false);
      setRedirecting(true);
      setTimeout(() => {
        window.location.href = shop.url;
      }, 2000);
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
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <img src="/maxit.png" alt="Company Logo" className="mx-auto mb-4 w-20" />
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {redirecting ? (
          <div className="text-center">
            <div className="animate-pulse mb-4">
              <div className="h-12 w-12 mx-auto border-t-2 border-b-2 border-orange-500 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Redirecting you to {getStoreName(shop.url)}</h2>
            <p className="text-gray-600">Please wait while we take you to download the Maxit app...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-orange-500">Enter Your Phone Number</h2>
            <p className="text-sm text-gray-600 mb-4">Please enter a valid Orange phone number starting with 072, 073, 074, 075, 076, 078, or 079.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  placeholder="Enter 9-digit Orange number"
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || error || phoneNumber.length !== 9}
                className="w-full bg-black text-orange-500 py-3 px-4 rounded hover:bg-orange-500 hover:text-black transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Submitting..." : "Download Maxit App"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Scanner;