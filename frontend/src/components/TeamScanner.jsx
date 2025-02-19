import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { teams } from "../data/shops";
// import { teams } from "../data/teams";

function TeamScanner() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agentName, setAgentName] = useState("");
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  const team = teams.find((t) => t.id === teamId);
  const validPrefixes = ["072", "073", "074", "075", "076", "078", "079"];

  useEffect(() => {
    console.log("TeamScanner component loaded");
    if (!team) {
      console.error("Invalid team ID:", teamId);
      return;
    }
  }, [teamId, team]);

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
      setError(validatePhoneNumber(value));
    }
  };

  const handleAgentNameChange = (e) => {
    setAgentName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validatePhoneNumber(phoneNumber);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!agentName.trim()) {
      setError("Agent name is required.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/team-scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId,
          phoneNumber,
          agentName,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        setError(data.message);
        setIsLoading(false);
        return;
      }
      console.log("Scan recorded successfully");
      setRedirecting(true);
      setTimeout(() => {
        window.location.href = team.url;
      }, 2000);
    } catch (error) {
      console.error("Failed to record scan:", error.message);
      setIsLoading(false);
    }
  };

  if (!team) {
    return <div className="text-xl text-red-600">Invalid team ID</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-orange-500">Team Scan</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={agentName}
            onChange={handleAgentNameChange}
            placeholder="Agent Name"
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="Enter 9-digit Orange number"
            className="w-full p-3 border rounded"
            required
          />
          <button
            type="submit"
            disabled={isLoading || error || phoneNumber.length !== 9 || !agentName.trim()}
            className="w-full bg-black text-orange-500 py-3 px-4 rounded hover:bg-orange-500 hover:text-black transition duration-200 disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Download Maxit App"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TeamScanner;
