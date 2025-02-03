import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { shops } from '../data/shops';
import { Smartphone, Phone, TrendingUp, Download } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'maxitScanData';
const LAST_UPDATE_KEY = 'maxitLastUpdate';

const TopPerformers = ({ scanData, title }) => {
  const getShopPerformance = () => {
    return shops.map(shop => ({
      ...shop,
      scans: (scanData[shop.id]?.count || 0),
      phoneNumbers: (scanData[shop.id]?.phoneNumbers || []).length
    }))
    .sort((a, b) => b.scans - a.scans)
    .slice(0, 5);
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-8 p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">
          Top Performing Shops - {title}
        </h3>
      </div>

      <div className="bg-black/5 rounded-lg p-4">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-black/10">
              <th className="pb-2 text-sm font-semibold text-black/70">Shop</th>
              <th className="pb-2 text-sm font-semibold text-black/70">Scans</th>
              <th className="pb-2 text-sm font-semibold text-black/70">Phone Numbers</th>
            </tr>
          </thead>
          <tbody>
            {getShopPerformance().map((shop) => (
              <tr key={shop.id} className="border-b border-black/5">
                <td className="py-3 text-sm font-medium">{shop.name}</td>
                <td className="py-3 text-sm">{shop.scans}</td>
                <td className="py-3 text-sm">{shop.phoneNumbers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function Dashboard() {
  const [scanData, setScanData] = useState({});
  const [activeTab, setActiveTab] = useState('weekly');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const androidShops = shops.filter(shop => shop.platform === 'android');
  const iphoneShops = shops.filter(shop => shop.platform === 'iphone');

  

  const exportToCSV = (data, filename) => {
    const exportData = data.map(shop => ({
      Shop: shop.name,
      Scans: getShopData(shop.id).count,
      'Phone Numbers': getShopData(shop.id).phoneNumbers.join(', ') || 'No numbers'
    
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    const storedLastUpdate = localStorage.getItem(LAST_UPDATE_KEY);
    
    if (storedData) {
      setScanData(JSON.parse(storedData));
      setLastUpdate(storedLastUpdate);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(scanData).length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(scanData));
      const currentTime = new Date().toISOString();
      localStorage.setItem(LAST_UPDATE_KEY, currentTime);
      setLastUpdate(currentTime);
    }
  }, [scanData]);

  const fetchScanData = async () => {
    try {
      const response = await fetch(`https://qrcode-compition.onrender.com/api/scans`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setScanData(data);
      setIsOffline(false);
    } catch (error) {
      console.error('Failed to fetch scan data:', error);
      setIsOffline(true);
    }
  };

  useEffect(() => {
    fetchScanData();
    const interval = setInterval(() => {
      fetchScanData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getShopData = (shopId) => {
    return scanData[shopId] || { count: 0, phoneNumbers: [] };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-white">
            Maxit Shop QR Code Analytics Dashboard
          </h1>
          <p className="text-white/90 mt-2">
            Real-time monitoring of QR code scans and customer engagement across all shop locations
          </p>
          {isOffline && (
            <div className="mt-4 bg-white/10 rounded-lg p-3 text-white">
              ⚠️ Currently showing cached data. Last updated: {new Date(lastUpdate).toLocaleString()}
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'weekly'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-50'
              }`}
            >
              Weekly Performance
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'monthly'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-orange-50'
              }`}
            >
              Monthly Performance
            </button>
          </div>
          
          {activeTab === 'weekly' && (
            <TopPerformers scanData={scanData} title="This Week" />
          )}
          {activeTab === 'monthly' && (
            <TopPerformers scanData={scanData} title="This Month" />
          )}
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-semibold text-gray-900">Android Shops</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => exportToCSV(androidShops, 'android-shops')}
                className="flex items-center px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-black">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Shops</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Scans</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Phone Numbers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">QR URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {androidShops.map((shop) => {
                  const data = getShopData(shop.id);
                  return (
                    <tr key={shop.id} className="hover:bg-orange-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{shop.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.phoneNumbers.length}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 hover:text-orange-700">{shop.url}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Phone className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-semibold text-gray-900">iPhone Shops</h2>
            </div>
            <div className="flex gap-2">
             
              <button
                onClick={() => exportToCSV(iphoneShops, 'iphone-shops')}
                className="flex items-center px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-black">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Shop</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Scans</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Phone Numbers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">QR URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {iphoneShops.map((shop) => {
                  const data = getShopData(shop.id);
                  return (
                    <tr key={shop.id} className="hover:bg-orange-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{shop.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.phoneNumbers.length}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 hover:text-orange-700">{shop.url}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;