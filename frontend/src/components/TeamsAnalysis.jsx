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
    if (scanData.length) {
      generateLeaderboards();
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
  const normalizeTeamName = (team) => team.replace(/-android|-iphone/gi, "").toLowerCase();

  const generateLeaderboards = () => {
  const teamCounts = {};
  const agentCounts = {};
  const agentTeams = {}; // Store the team name for each agent

  scanData.forEach(({ teamId, agentName, userId }) => {
    const team = normalizeTeamName(teamId);
    teamCounts[team] = (teamCounts[team] || 0) + 1;

    const agent = normalizeText(agentName || userId || "Unknown");
    agentCounts[agent] = (agentCounts[agent] || 0) + 1;

    // Store the team name for each agent
    if (!agentTeams[agent]) {
      agentTeams[agent] = team;
    }
  });

  setTeamLeaderboard(
    Object.entries(teamCounts)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  );

  setAgentLeaderboard(
    Object.entries(agentCounts)
      .map(([name, count]) => ({ name, count, teamName: agentTeams[name] })) // Include the teamName
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  );
};


  const getMedalColor = (index) => ["bg-yellow-500", "bg-gray-300", "bg-amber-600"][index] || "bg-gray-200";

  if (isLoading) return <div className="p-6 text-center">Loading leaderboard data...</div>;

  const LeaderboardCard = ({ title, icon, leaderboard, type }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className={`p-4 flex items-center ${type === "team" ? "bg-blue-600" : "bg-purple-600"}`}>
        {icon} <h2 className="text-xl font-bold text-white ml-2">Top 5 {title}</h2>
      </div>
      <div className="p-4">
        {leaderboard.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No data available</p>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((item, index) => (
              <div key={item.id || item.name} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className={`${getMedalColor(index)} w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white font-bold`}>{index + 1}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {type === "team" ? <Users className="w-5 h-5 text-blue-600 mr-2" /> : <User className="w-5 h-5 text-purple-600 mr-2" />}
                     
                      <span className="font-semibold text-gray-800 capitalize">{item.id || item.name}</span> <div className="ml-5 text-sm text-gray-600"> {"- " + item.teamName}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full font-medium ${type === "team" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>{item.count} scans</div>
                  </div>
                  
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div className={`${type === "team" ? "bg-blue-600" : "bg-purple-600"} h-2 rounded-full`} style={{ width: `${(item.count / leaderboard[0].count) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <LeaderboardCard title="Teams" icon={<Trophy className="w-6 h-6 text-white" />} leaderboard={teamLeaderboard} type="team" />
      <LeaderboardCard title="Agents" icon={<Trophy className="w-6 h-6 text-white" />} leaderboard={agentLeaderboard} type="agent" />
    </div>
  );
}

export default TeamsLeaderboard;
