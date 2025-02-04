
// import React, { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import { shops } from '../data/shops';
// import { Smartphone, Phone, TrendingUp, Download } from 'lucide-react';

// function Dashboard() {
//   const [scanData, setScanData] = useState([]);
//   const [totalScans, setTotalScans] = useState(0);

//   useEffect(() => {
//     fetchScanData();
//   }, []);

//   const fetchScanData = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/scans");
//       const data = await response.json();
//       setScanData(data.scans || []);
//       setTotalScans(data.scans.length); // Update total scan count
//     } catch (error) {
//       console.error('Failed to fetch scan data:', error);
//     }
//   };

//   const exportToCSV = (data, filename) => {
//     const exportData = data.map(shop => ({
//       Shop: shop.shopId,
//       'Phone Numbers': shop.phoneNumber || 'No numbers'
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const csv = XLSX.utils.sheet_to_csv(ws);
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = `${filename}.csv`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // const androidScans = scanData.filter(scan => scan.platform === 'android');
//   // const iphoneScans = scanData.filter(scan => scan.platform === 'iphone');

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-8 mb-8">
//           <h1 className="text-3xl font-bold text-white">Maxit Shop QR Code Analytics Dashboard</h1>
//           <p className="text-white/90 mt-2">
//             Real-time monitoring of QR code scans and customer engagement across all shop locations.
//           </p>
//         </div>

//         {/* Total Scans Section */}
//         <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <TrendingUp className="w-6 h-6 text-green-500" />
//             <h2 className="text-xl font-semibold text-gray-900">Total Scans:</h2>
//           </div>
//           <span className="text-2xl font-bold text-gray-800">{totalScans}</span>
//         </div>

//         {/* Android Shops Table */}
//         <div className="mb-12">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <Smartphone className="w-6 h-6 text-orange-500" />
//               <h2 className="text-2xl font-semibold text-gray-900">Orange Shops</h2>
//             </div>
//             <button
//               onClick={() => exportToCSV(androidScans, 'android-shops')}
//               className="flex items-center px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
//             >
//               <Download className="w-4 h-4 mr-2" />
//               Export CSV
//             </button>
//           </div>
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-black">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Shop Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Phone Numbers</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {scanData.map(shop => (
//                   <tr key={shop.id} className="hover:bg-orange-50 transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{shop.shopId}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shop.phoneNumber || 'No Number'}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;



import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Smartphone, TrendingUp, Download } from 'lucide-react';

function Dashboard() {
  const [scanData, setScanData] = useState([]);
  const [totalScans, setTotalScans] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const scansPerPage = 30;

  useEffect(() => {
    fetchScanData();
    const interval = setInterval(fetchScanData, 2000); // Auto-reload every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchScanData = async () => {
    try {
      const response = await fetch("https://qrcode-compition.onrender.com/api/scans");
      const data = await response.json();
      setScanData(data.scans || []);
      setTotalScans(data.scans.length);
    } catch (error) {
      console.error('Failed to fetch scan data:', error);
    }
  };

  const exportToCSV = () => {
    const exportData = scanData.map(scan => ({
      'Shop Name': scan.shopId,
      'Phone Number': scan.phoneNumber || 'No Number'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Scans');
    XLSX.writeFile(wb, 'scan_data.csv');
  };

  // Pagination Logic
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-white">Maxit Shop QR Code Analytics Dashboard</h1>
          <p className="text-white/90 mt-2">Real-time monitoring of QR code scans.</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-900">Total Scans:</h2>
          </div>
          <span className="text-2xl font-bold text-gray-800">{totalScans}</span>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-semibold text-gray-900">Recent Scans</h2>
            </div>
            <button onClick={exportToCSV} className="flex items-center px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-black">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Shop Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Phone Number</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentScans.map(scan => (
                  <tr key={scan.id} className="hover:bg-orange-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{scan.shopId}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{scan.phoneNumber || 'No Number'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button onClick={prevPage} disabled={currentPage === 1} className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50">
              Previous
            </button>
            <span className="text-gray-700">Page {currentPage}</span>
            <button onClick={nextPage} disabled={indexOfLastScan >= scanData.length} className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
