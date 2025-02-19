import React from 'react';
import { BarChart, Calendar, ChevronDown } from 'lucide-react';

function Analysis({ scanAnalysis, analysisView, toggleAnalysisView }) {
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
}

export default Analysis;
