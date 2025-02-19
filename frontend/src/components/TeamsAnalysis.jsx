// import React from 'react';
// import { BarChart } from 'lucide-react';

// function TeamsAnalysis() {
//   return (
//     <div className="mb-6">
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <div className="flex items-center gap-2 mb-4">
//           <BarChart className="w-6 h-6 text-blue-500" />
//           <h2 className="text-2xl font-semibold text-gray-900">Team Analysis</h2>
//         </div>
//         <p className="text-gray-600">This section will provide detailed analytics on team performance.</p>
//       </div>
//     </div>
//   );
// }

// export default TeamsAnalysis;

import React, { useState, useEffect } from "react";
import { BarChart, Calendar, ChevronDown } from "lucide-react";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);

function TeamsAnalysis() {
  const [teamScanData, setTeamScanData] = useState([]);
  const [analysisView, setAnalysisView] = useState(null);
  const [scanAnalysis, setScanAnalysis] = useState({
    weeklyTotalScans: {},
    monthlyTotalScans: {},
  });

  useEffect(() => {
    fetchTeamScanData();
  }, []);

  useEffect(() => {
    if (teamScanData.length > 0) {
      analyzeScanData();
    }
  }, [teamScanData]);

  const fetchTeamScanData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/team-scans");
      const data = await response.json();
      setTeamScanData(data);
    } catch (error) {
      console.error("Failed to fetch team scan data:", error);
    }
  };

  const analyzeScanData = () => {
    const weeklyTotalScans = {};
    const monthlyTotalScans = {};

    teamScanData.forEach((scan) => {
      const scanDate = dayjs(scan.createdAt);
      const week = `${scanDate.year()}-W${scanDate.week()}`;
      const month = scanDate.format("YYYY-MM");
      const teamId = scan.teamId;

      // Initialize counters
      if (!weeklyTotalScans[teamId]) weeklyTotalScans[teamId] = 0;
      if (!monthlyTotalScans[teamId]) monthlyTotalScans[teamId] = 0;

      // Count total scans per team for weekly and monthly
      weeklyTotalScans[teamId] += 1;
      monthlyTotalScans[teamId] += 1;
    });

    setScanAnalysis({
      weeklyTotalScans,
      monthlyTotalScans,
    });
  };

  return (
    <div className="mb-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Team Analysis
          </h2>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setAnalysisView("week")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              analysisView === "week"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <Calendar className="w-5 h-5" /> Weekly Scans
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                analysisView === "week" ? "rotate-180" : ""
              }`}
            />
          </button>

          <button
            onClick={() => setAnalysisView("month")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              analysisView === "month"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <Calendar className="w-5 h-5" /> Monthly Scans
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                analysisView === "month" ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {analysisView === "week" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Weekly Total Scans
            </h2>
            {Object.entries(scanAnalysis.weeklyTotalScans).map(
              ([teamId, totalScans]) => (
                <div key={teamId} className="mb-2 p-3 bg-gray-50 rounded-lg">
                  <span className="font-bold text-gray-800 capitalize">
                    {teamId}:
                  </span>{" "}
                  <span className="text-blue-600 font-semibold">
                    {totalScans} scans
                  </span>
                </div>
              )
            )}
          </div>
        )}

        {analysisView === "month" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Monthly Total Scans
            </h2>
            {Object.entries(scanAnalysis.monthlyTotalScans).map(
              ([teamId, totalScans]) => (
                <div key={teamId} className="mb-2 p-3 bg-gray-50 rounded-lg">
                  <span className="font-bold text-gray-800 capitalize">
                    {teamId}:
                  </span>{" "}
                  <span className="text-blue-600 font-semibold">
                    {totalScans} scans
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamsAnalysis;
