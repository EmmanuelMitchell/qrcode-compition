import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

function TeamsCampaign() {
  const [teamScans, setTeamScans] = useState([]);
  const [teamAnalysis, setTeamAnalysis] = useState({
    teamLeaderboard: [],
    topTeam: null,
    topAgent: null,
    totalScans: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const scansPerPage = 5;

  useEffect(() => {
    fetch('http://localhost:5000/api/team-scans')
      .then(response => response.json())
      .then(data => {
        const enrichedData = data.teamScans.map(scan => ({
          ...scan,
          teamName: assignTeam(scan.teamId),
        }));
        setTeamScans(enrichedData);
        analyzeTeamData(enrichedData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const assignTeam = (teamId) => {
    const teamNames = [
      'Waterloo', 'Rokel', 'Jui', 'Calaba town', 'Wellington', 'Portee', 'Shell',
      'Ferry Junction', 'Upgun', 'Eastern Police', 'Rawdon Street', 'St. John',
      'Krootown road', 'Model New Road', 'Congo Cross', 'Aberdeen', 'Lumley',
      'Wilberforce', 'Funkia', 'Metchem', 'South', 'East 1 (Kenema)', 'East 2 (Kono)',
      'North West', 'North'
    ];
    return teamNames[parseInt(teamId.replace('team_', ''), 10) % teamNames.length];
  };

  const analyzeTeamData = (teamData) => {
    const teamTotals = {};
    const agentTotals = {};
    let totalScans = teamData.length;

    teamData.forEach(scan => {
      teamTotals[scan.teamId] = (teamTotals[scan.teamId] || 0) + 1;
      agentTotals[scan.agentName] = (agentTotals[scan.agentName] || 0) + 1;
    });

    const teamLeaderboard = Object.entries(teamTotals)
      .map(([teamId, count]) => ({ teamId, count }))
      .sort((a, b) => b.count - a.count);

    const topTeam = teamLeaderboard[0];

    const topAgent = Object.entries(agentTotals)
      .map(([agentName, count]) => ({ agentName, count }))
      .sort((a, b) => b.count - a.count)[0];

    setTeamAnalysis({ teamLeaderboard, topTeam, topAgent, totalScans });
  };

  const exportTeamDataToCSV = () => {
    const exportData = teamScans.map(scan => ({
      'Team': scan.teamName,
      'Shop Name': scan.shopId,
      'Agent Name': scan.agentName,
      'Phone Number': scan.phoneNumber || 'No Number',
      'Scan Date': dayjs(scan.createdAt).format('MMMM D, YYYY h:mm A')
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Team Scans');
    XLSX.writeFile(wb, 'team_scan_data.csv');
  };

  const indexOfLastScan = currentPage * scansPerPage;
  const indexOfFirstScan = indexOfLastScan - scansPerPage;
  const currentTeamScans = teamScans.slice(indexOfFirstScan, indexOfLastScan);

  const totalPages = Math.ceil(teamScans.length / scansPerPage);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">Team Scans</h2>
        <button onClick={exportTeamDataToCSV} className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 flex items-center">
          <Download className="w-4 h-4 mr-2" /> Export Team Data
        </button>
      </div>

      <div className="flex justify-between gap-5 mb-4 ">
        {teamAnalysis.topTeam && (
          <div className="p-6 bg-blue-500 text-white rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-bold">Top Team: {teamAnalysis.topTeam.teamId}</h3>
            <p className="text-lg">Scans: {teamAnalysis.topTeam.count}</p>
          </div>
        )}

        {teamAnalysis.topAgent && (
          <div className="p-6 bg-green-500 text-white rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-bold">Top Agent: {teamAnalysis.topAgent.agentName}</h3>
            <p className="text-lg">Scans: {teamAnalysis.topAgent.count}</p>
          </div>
        )}

        <div className="p-6 bg-gray-500 text-white rounded-lg shadow-lg w-1/3">
          <h3 className="text-xl font-bold">Total Scans</h3>
          <p className="text-lg">{teamAnalysis.totalScans}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Scan Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Team Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Phone Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Agent Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentTeamScans.map(scan => (
              <tr key={scan.id} className="hover:bg-orange-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{dayjs(scan.createdAt).format('MMMM D, YYYY h:mm A')}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{scan.teamId}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{scan.phoneNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{scan.agentName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50">Previous</button>
        <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}

export default TeamsCampaign;


