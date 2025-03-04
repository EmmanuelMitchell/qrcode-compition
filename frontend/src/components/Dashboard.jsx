import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Smartphone, TrendingUp, Download, BarChart, Calendar, ChevronDown, Users, User } from 'lucide-react';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import TeamsCampaign from './TeamsCampaign'; 
import TeamsLeaderboard from './TeamsAnalysis';
// import WeeklyTeamsCampaign from './WeeklyTeamsCampaign';
// import AgentCampaign from './WeeklyTeamsCampaign';
import AgentAnalysis from './AgentAnalysis';
import AgentCampaign from './AgentCampaign';
dayjs.extend(weekOfYear);

function Dashboard() {
  const [scanData, setScanData] = useState([]);
  const [totalScans, setTotalScans] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('shop-campaign');
  const [analysisView, setAnalysisView] = useState(null);
  const [scanAnalysis, setScanAnalysis] = useState({
    weeklyScansByShop: {},
    monthlyScansByShop: {}
  });
  const scansPerPage = 10;

  useEffect(() => {
    fetchScanData();
    const interval = setInterval(fetchScanData, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scanData.length > 0) {
      analyzeScanData();
    }
  }, [scanData]);

  const fetchScanData = async () => {
    try {
      const response = await fetch("https://qrcode-compition-back.vercel.app/api/scans");
      const data = await response.json();
      setScanData(data.scans || []);
      setTotalScans(data.scans.length);
    } catch (error) {
      console.error('Failed to fetch scan data:', error);
    }
  };

  const analyzeScanData = () => {
    const weeklyScansByShop = {};
    const monthlyScansByShop = {};

    scanData.forEach(scan => {
      const scanDate = dayjs(scan.createdAt);
      const week = `${scanDate.year()}-W${scanDate.week()}`;
      const month = scanDate.format('YYYY-MM');

      weeklyScansByShop[scan.shopId] = weeklyScansByShop[scan.shopId] || {};
      weeklyScansByShop[scan.shopId][week] = 
        (weeklyScansByShop[scan.shopId][week] || 0) + 1;

      monthlyScansByShop[scan.shopId] = monthlyScansByShop[scan.shopId] || {};
      monthlyScansByShop[scan.shopId][month] = 
        (monthlyScansByShop[scan.shopId][month] || 0) + 1;
    });

    const processedWeeklyScansByShop = Object.fromEntries(
      Object.entries(weeklyScansByShop).map(([shopId, weekData]) => {
        const highestWeekScans = Object.entries(weekData).reduce(
          (max, [week, count]) => count > max.count ? { week, count } : max, 
          { week: '', count: 0 }
        );
        return [shopId, highestWeekScans];
      })
    );

    const processedMonthlyScansByShop = Object.fromEntries(
      Object.entries(monthlyScansByShop).map(([shopId, monthData]) => {
        const highestMonthScans = Object.entries(monthData).reduce(
          (max, [month, count]) => count > max.count ? { month, count } : max, 
          { month: '', count: 0 }
        );
        return [shopId, highestMonthScans];
      })
    );

    setScanAnalysis({
      weeklyScansByShop: processedWeeklyScansByShop,
      monthlyScansByShop: processedMonthlyScansByShop
    });
  };

  const exportToCSV = () => {
    const exportData = scanData.map(scan => ({
      'Shop Name': scan.shopId,
      'Phone Number': scan.phoneNumber || 'No Number',
      'Scan Date': dayjs(scan.createdAt).format('MMMM D, YYYY h:mm A')
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Scans');
    XLSX.writeFile(wb, 'scan_data.csv');
  };

  const indexOfLastScan = currentPage * scansPerPage;
  const indexOfFirstScan = indexOfLastScan - scansPerPage;
  const currentScans = scanData.slice(indexOfFirstScan, indexOfLastScan);

  const nextPage = () => {
    if (indexOfLastScan < scanData.length) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const toggleAnalysisView = (view) => {
    setAnalysisView(prevView => prevView === view ? null : view);
  };

  const renderShopCampaignTab = () => {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-semibold text-gray-900">Shop Scans</h2>
          </div>
          <button onClick={exportToCSV} className="flex items-center px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-black">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Scan Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Shop Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Phone Number</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentScans.map(scan => (
                <tr key={scan.id} className="hover:bg-orange-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 ">{dayjs(scan.createdAt).format('MMMM D, YYYY h:mm A')}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">{scan.shopId}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 ">{scan.phoneNumber || 'No Number'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1} 
            className="px-4 py-2 rounded-xl bg-black text-gray-300 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-gray-700">Page {currentPage}</span>
          <button 
            onClick={nextPage} 
            disabled={indexOfLastScan >= scanData.length} 
            className="px-4 py-2 rounded-xl bg-black text-gray-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const renderAnalysisTab = () => {
    return (
      <div className="mb-6">
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => toggleAnalysisView('week')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              analysisView === 'week' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            <Calendar className="w-5 h-5" /> Weekly Scans
            <ChevronDown className={`w-4 h-4 transition-transform ${
              analysisView === 'week' ? 'rotate-180' : ''
            }`} />
          </button>
          <button 
            onClick={() => toggleAnalysisView('month')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              analysisView === 'month' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            <Calendar className="w-5 h-5" /> Monthly Scans
            <ChevronDown className={`w-4 h-4 transition-transform ${
              analysisView === 'month' ? 'rotate-180' : ''
            }`} />
          </button>
        </div>

        {analysisView === 'week' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-semibold text-gray-900">Weekly Scan Analysis</h2>
            </div>
            {Object.entries(scanAnalysis.weeklyScansByShop).map(([shopId, weekData]) => (
              <div key={shopId} className="mb-2 p-3 bg-gray-50 rounded-lg">
                <span className="font-bold text-gray-800 capitalize">{shopId}:</span>{' '}
                <span className="text-orange-600 font-semibold">{weekData.count} scans</span>{' '}
                in Week {weekData.week}
              </div>
            ))}
          </div>
        )}

        {analysisView === 'month' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-semibold text-gray-900">Monthly Scan Analysis</h2>
            </div>
            {Object.entries(scanAnalysis.monthlyScansByShop).map(([shopId, monthData]) => (
              <div key={shopId} className="mb-2 p-3 bg-gray-50 rounded-lg">
                <span className="font-bold text-gray-800 capitalize">{shopId}:</span>{' '}
                <span className="text-orange-600 font-semibold">{monthData.count} scans</span>{' '}
                in {monthData.month}
              </div>
            ))}
          </div>
        )}

        {!analysisView && (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-xl text-gray-600 mb-2">Select an Analysis View</h3>
            <p className="text-gray-500">Click on either Weekly or Monthly buttons above to view scan statistics</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-white">Maxit QR Code Analytics Dashboard</h1>
          <p className="text-white/90 mt-2">Real-time monitoring of QR code scans.</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-900">Total Shop Scans:</h2>
          </div>
          <span className="text-2xl font-bold text-gray-800">{totalScans}</span>
        </div>

       
        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('shop-campaign')}
              className={`py-4 px-6 text-center font-medium text-sm cursor-pointer border-b-2 transition duration-200 
                ${activeTab === 'shop-campaign' 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                <span>Shop Campaign</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`py-4 px-6 text-center font-medium text-sm cursor-pointer border-b-2 transition duration-200 
                ${activeTab === 'analysis' 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                <span>Shop Analysis</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('teams-campaign')}
              className={`py-4 px-6 text-center font-medium text-sm cursor-pointer border-b-2 transition duration-200 
                ${activeTab === 'teams-campaign' 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Teams Campaign</span>
              </div>
            </button>
            <button
      onClick={() => setActiveTab('agent-campaign')}
      className={`py-4 px-6 text-center font-medium text-sm cursor-pointer border-b-2 transition duration-200 
        ${activeTab === 'agent-campaign' 
          ? 'border-orange-500 text-orange-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
    >
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        <span>Agent Campaign</span>
      </div>
    </button>
            <button
              onClick={() => setActiveTab('team-analysis')}
              className={`py-4 px-6 text-center font-medium text-sm cursor-pointer border-b-2 transition duration-200 
                ${activeTab === 'team-analysis' 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Teams Analysis</span>
              </div>
            </button>
            <button
  onClick={() => setActiveTab('agent-analysis')}
  className={`py-4 px-6 text-center font-medium text-sm cursor-pointer border-b-2 transition duration-200 
    ${activeTab === 'agent-analysis' 
      ? 'border-orange-500 text-orange-600' 
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
>
  <div className="flex items-center gap-2">
    <User className="w-5 h-5" />
    <span>Agent Analysis</span>
  </div>
</button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'shop-campaign' && renderShopCampaignTab()}
          {activeTab === 'analysis' && renderAnalysisTab()}
          {activeTab === 'teams-campaign' && <TeamsCampaign  />}
          {activeTab === 'agent-campaign' && <AgentCampaign  />} 
          {/* {activeTab === 'team-analysis' && <TeamsAnalysis  />}  */}
          {activeTab === 'agent-analysis' && <AgentAnalysis />}
          {activeTab === 'team-analysis' && <TeamsLeaderboard  />} 
        </div>
      </div>
    </div>
  );
}

export default Dashboard;