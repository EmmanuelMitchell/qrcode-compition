// import React, { useState, useEffect } from "react";
// import { Trophy, Users, User, Smartphone, Apple } from "lucide-react";

// function TeamsLeaderboard() {
//   const [scanData, setScanData] = useState([]);
//   const [teamLeaderboard, setTeamLeaderboard] = useState([]);
//   const [agentLeaderboard, setAgentLeaderboard] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchScanData();
//   }, []);

//   useEffect(() => {
//     if (scanData.length > 0) {
//       generateLeaderboards();
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

//   const generateLeaderboards = () => {
//     const teamCounts = {};
//     const agentCounts = {};

//     scanData.forEach((scan) => {
//       const teamId = scan.teamId || "Unknown";
//       const agentKey = scan.agentName || scan.userId || "Unknown";
//       const isAndroid = scan.deviceType === "android";
//       const isIphone = scan.deviceType === "iphone";

//       if (!teamCounts[teamId]) {
//         teamCounts[teamId] = { total: 0, android: 0, iphone: 0 };
//       }
//       teamCounts[teamId].total += 1;
//       if (isAndroid) teamCounts[teamId].android += 1;
//       if (isIphone) teamCounts[teamId].iphone += 1;

//       agentCounts[agentKey] = (agentCounts[agentKey] || 0) + 1;
//     });

//     const sortedTeams = Object.entries(teamCounts)
//       .map(([id, counts]) => ({ id, ...counts }))
//       .sort((a, b) => b.total - a.total)
//       .slice(0, 25);

//     const sortedAgents = Object.entries(agentCounts)
//       .map(([name, count]) => ({ name, count }))
//       .sort((a, b) => b.count - a.count)
//       .slice(0, 25);

//     setTeamLeaderboard(sortedTeams);
//     setAgentLeaderboard(sortedAgents);
//   };

//   const getMedalColor = (index) => {
//     return ["bg-yellow-500", "bg-gray-300", "bg-amber-600"][index] || "bg-gray-200";
//   };

//   if (isLoading) {
//     return <div className="p-6 text-center">Loading leaderboard data...</div>;
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="bg-blue-600 p-4 flex items-center">
//           <Trophy className="w-6 h-6 text-white mr-2" />
//           <h2 className="text-xl font-bold text-white">Top 25 Teams</h2>
//         </div>
//         <div className="p-4">
//           {teamLeaderboard.map((team, index) => (
//             <div key={team.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
//               <div className={`${getMedalColor(index)} w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white font-bold`}>{index + 1}</div>
//               <div className="flex-1">
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center">
//                     <Users className="w-5 h-5 text-blue-600 mr-2" />
//                     <span className="font-semibold text-gray-800 capitalize">{team.id}</span>
//                   </div>
//                   <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">{team.total} scans</div>
//                 </div>
//                 <div className="flex space-x-4 mt-2">
//                   <div className="flex items-center text-green-600"><Smartphone className="w-4 h-4 mr-1" /> {team.android}</div>
//                   <div className="flex items-center text-gray-700"><Apple className="w-4 h-4 mr-1" /> {team.iphone}</div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="bg-purple-600 p-4 flex items-center">
//           <Trophy className="w-6 h-6 text-white mr-2" />
//           <h2 className="text-xl font-bold text-white">Top 25 Agents</h2>
//         </div>
//         <div className="p-4">
//           {agentLeaderboard.map((agent, index) => (
//             <div key={agent.name} className="flex items-center p-3 bg-gray-50 rounded-lg">
//               <div className={`${getMedalColor(index)} w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white font-bold`}>{index + 1}</div>
//               <div className="flex-1">
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center">
//                     <User className="w-5 h-5 text-purple-600 mr-2" />
//                     <span className="font-semibold text-gray-800">{agent.name}</span>
//                   </div>
//                   <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">{agent.count} scans</div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TeamsLeaderboard;


import React, { useState, useEffect } from "react";
import { Trophy, Users, User } from "lucide-react";

function TeamsLeaderboard() {
  const [scanData, setScanData] = useState([]);
  const [teamLeaderboard, setTeamLeaderboard] = useState([]);
  const [agentLeaderboard, setAgentLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchScanData();
  }, []);

  useEffect(() => {
    if (scanData.length > 0) {
      generateLeaderboards();
    }
  }, [scanData]);

  const fetchScanData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://qrcode-compition-back.vercel.app/api/team-scans");
      const data = await response.json();
      console.log("Scan Data:", data.teamScans);
      setScanData(data.teamScans || []);
    } catch (error) {
      console.error("Failed to fetch scan data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateLeaderboards = () => {
    const teamCounts = {};
    const agentCounts = {};

    scanData.forEach((scan) => {
      // Normalize team names by removing device suffixes
      const normalizedTeam = scan.teamId.replace(/-android|-iphone/gi, "");
      
      if (!teamCounts[normalizedTeam]) {
        teamCounts[normalizedTeam] = 0;
      }
      teamCounts[normalizedTeam] += 1;

      // Count agent scans
      const agentKey = scan.agentName || scan.userId || "Unknown";
      agentCounts[agentKey] = (agentCounts[agentKey] || 0) + 1;
    });

    // Sort and get top 25 teams
    const sortedTeams = Object.entries(teamCounts)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 25);

    // Sort and get top 25 agents
    const sortedAgents = Object.entries(agentCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 25);

    setTeamLeaderboard(sortedTeams);
    setAgentLeaderboard(sortedAgents);
  };

  const getMedalColor = (index) => {
    switch (index) {
      case 0: return "bg-yellow-500";
      case 1: return "bg-gray-300";
      case 2: return "bg-amber-600";
      default: return "bg-gray-200";
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading leaderboard data...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Team Leaderboard */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-4 flex items-center">
          <Trophy className="w-6 h-6 text-white mr-2" />
          <h2 className="text-xl font-bold text-white">Top 25 Teams</h2>
        </div>
        <div className="p-4">
          {teamLeaderboard.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No team data available</p>
          ) : (
            <div className="space-y-4">
              {teamLeaderboard.map((team, index) => (
                <div key={team.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className={`${getMedalColor(index)} w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white font-bold`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-gray-800 capitalize">{team.id} Total</span>
                      </div>
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                        {team.count} scans
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(team.count / teamLeaderboard[0].count) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Agent Leaderboard */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-purple-600 p-4 flex items-center">
          <Trophy className="w-6 h-6 text-white mr-2" />
          <h2 className="text-xl font-bold text-white">Top 25 Agents</h2>
        </div>
        <div className="p-4">
          {agentLeaderboard.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No agent data available</p>
          ) : (
            <div className="space-y-4">
              {agentLeaderboard.map((agent, index) => (
                <div key={agent.name} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className={`${getMedalColor(index)} w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white font-bold`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="font-semibold text-gray-800">{agent.name}</span>
                      </div>
                      <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                        {agent.count} scans
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${(agent.count / agentLeaderboard[0].count) * 100}%` }}
                      ></div>
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

export default TeamsLeaderboard;
