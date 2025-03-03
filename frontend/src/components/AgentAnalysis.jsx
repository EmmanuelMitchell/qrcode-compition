// import React, { useState, useEffect } from "react";
// import { Trophy, Users, User, Calendar } from "lucide-react";

// function AgentAnalysis() {
//   const [scanData, setScanData] = useState([]);
//   const [agentLeaderboard, setAgentLeaderboard] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const startDate = new Date('2025-02-28'); // February 28, 2025 (last Friday)

//   useEffect(() => {
//     fetchScanData();
//   }, []);

//   useEffect(() => {
//     if (scanData.length) {
//       generateLeaderboard();
//     }
//   }, [scanData]);

//   const fetchScanData = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch("https://qrcode-compition-back.vercel.app/api/team-scans");
//       const data = await response.json();
//       setScanData(data.teamScans || []);
//     } catch (error) {
//       console.error("Failed to fetch scan data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const normalizeText = (text) => text.toLowerCase().trim().replace(/\s+/g, " ");

//   const generateLeaderboard = () => {
//     const agentCounts = {};
//     const agentTeams = {}; // Store the team name for each agent

//     // Filter data to only include scans from February 28, 2025 onwards
//     const filteredData = scanData.filter(scan => {
//       const scanDate = new Date(scan.createdAt);
//       return scanDate >= startDate;
//     });

//     filteredData.forEach(({ teamId, agentName, userId, createdAt }) => {
//       const agent = normalizeText(agentName || userId || "Unknown");
//       agentCounts[agent] = (agentCounts[agent] || 0) + 1;

//       // Store the team name for each agent
//       if (!agentTeams[agent]) {
//         agentTeams[agent] = teamId;
//       }
//     });

//     setAgentLeaderboard(
//       Object.entries(agentCounts)
//         .map(([name, count]) => ({ name, count, teamName: agentTeams[name] }))
//         .sort((a, b) => b.count - a.count)
//         .slice(0, 10) // Show top 10 agents
//     );
//   };

//   const getMedalColor = (index) => ["bg-yellow-500", "bg-gray-300", "bg-amber-600"][index] || "bg-gray-200";

//   const formatDate = (date) => {
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(date).toLocaleDateString(undefined, options);
//   };

//   if (isLoading) return <div className="p-6 text-center">Loading agent data...</div>;

//   return (
//     <div className="space-y-4">
//       <div className="bg-white rounded-lg shadow-md p-4">
//         <div className="flex items-center gap-2 text-purple-700">
//           <Calendar className="w-5 h-5" />
//           <span className="font-medium">Showing data since {formatDate(startDate)}</span>
//         </div>
//       </div>
      
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="p-4 flex items-center bg-purple-600">
//           <Trophy className="w-6 h-6 text-white" />
//           <h2 className="text-xl font-bold text-white ml-2">Top 10 Agents</h2>
//         </div>
//         <div className="p-4">
//           {agentLeaderboard.length === 0 ? (
//             <p className="text-gray-500 text-center py-4">No agent data available for this time period</p>
//           ) : (
//             <div className="space-y-4">
//               {agentLeaderboard.map((item, index) => (
//                 <div key={item.name} className="flex items-center p-3 bg-gray-50 rounded-lg">
//                   <div className={`${getMedalColor(index)} w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white font-bold`}>{index + 1}</div>
//                   <div className="flex-1">
//                     <div className="flex justify-between items-center">
//                       <div className="flex items-center">
//                         <User className="w-5 h-5 text-purple-600 mr-2" />
//                         <span className="font-semibold text-gray-800 capitalize">{item.name}</span>
//                         <div className="ml-5 text-sm text-gray-600">Team: {item.teamName}</div>
//                       </div>
//                       <div className="px-3 py-1 rounded-full font-medium bg-purple-100 text-purple-800">{item.count} scans</div>
//                     </div>
                    
//                     <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
//                       <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(item.count / agentLeaderboard[0].count) * 100}%` }}></div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AgentAnalysis;


import React, { useState, useEffect } from "react";
import { Trophy, User, Calendar } from "lucide-react";

function AgentAnalysis() {
  const [scanData, setScanData] = useState([]);
  const [agentLeaderboard, setAgentLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const startDate = new Date('2025-02-28'); // February 28, 2025 (last Friday)

  useEffect(() => {
    fetchScanData();
  }, []);

  useEffect(() => {
    if (scanData.length) {
      generateLeaderboard();
    }
  }, [scanData]);

  const fetchScanData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://qrcode-compition-back.vercel.app/api/team-scans");
      const data = await response.json();
      setScanData(data.teamScans || []);
    } catch (error) {
      console.error("Failed to fetch scan data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const normalizeText = (text) => text.toLowerCase().trim().replace(/\s+/g, " ");

  const normalizeTeamName = (teamName) => {
    // Remove suffixes like '-android', '-iphone', etc.
    return teamName.split('-')[0];
  };

  const generateLeaderboard = () => {
    const agentCounts = {};
    const agentTeams = {}; // Store the team name for each agent

    // Filter data to only include scans from February 28, 2025 onwards
    const filteredData = scanData.filter(scan => {
      const scanDate = new Date(scan.createdAt);
      return scanDate >= startDate;
    });

    filteredData.forEach(({ teamId, agentName, userId, createdAt }) => {
      const agent = normalizeText(agentName || userId || "Unknown");
      const normalizedTeamId = normalizeTeamName(teamId); // Normalize team name

      // Sum counts for Android and iPhone scans under the same agent
      agentCounts[agent] = (agentCounts[agent] || 0) + 1;

      // Store the normalized team name for each agent
      if (!agentTeams[agent]) {
        agentTeams[agent] = normalizedTeamId;
      }
    });

    setAgentLeaderboard(
      Object.entries(agentCounts)
        .map(([name, count]) => ({ name, count, teamName: agentTeams[name] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10) // Show top 10 agents
    );
  };

  const getMedalColor = (index) => ["bg-yellow-500", "bg-gray-300", "bg-amber-600"][index] || "bg-gray-200";

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  if (isLoading) return <div className="p-6 text-center">Loading agent data...</div>;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 text-purple-700">
          <Calendar className="w-5 h-5" />
          <span className="font-medium">Showing data since {formatDate(startDate)}</span>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 flex items-center bg-purple-600">
          <Trophy className="w-6 h-6 text-white" />
          <h2 className="text-xl font-bold text-white ml-2">Top 10 Agents</h2>
        </div>
        <div className="p-4">
          {agentLeaderboard.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No agent data available for this time period</p>
          ) : (
            <div className="space-y-4">
              {agentLeaderboard.map((item, index) => (
                <div key={item.name} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className={`${getMedalColor(index)} w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white font-bold`}>{index + 1}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="font-semibold text-gray-800 capitalize">{item.name}</span>
                        <div className="ml-5 text-sm text-gray-600">{item.teamName}</div>
                      </div>
                      <div className="px-3 py-1 rounded-full font-medium bg-purple-100 text-purple-800">{item.count} scans</div>
                    </div>
                    
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(item.count / agentLeaderboard[0].count) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentAnalysis;
