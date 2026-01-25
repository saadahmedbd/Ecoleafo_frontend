// Test component to verify seller dashboard APIs
// Place this in src/pages/seller/DashboardTest.jsx
// Access via /seller/dashboard-test route

import { useState } from 'react';
 
import { usePageTitle } from '@/hooks/usePageTitle';
import {  
useGetSellerStatisticsQuery,
  useGetRecentOrdersQuery,
  useGetTopProductsQuery,
} from '@/features/seller_dashboard/dashboardApi';

export default function DashboardTest() {
  usePageTitle('Dashboard Test');
  const [showRaw, setShowRaw] = useState(true);

  const { data: stats, isLoading: statsLoading, error: statsError } = useGetSellerStatisticsQuery();
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useGetRecentOrdersQuery({ limit: 5 });
  const { data: products, isLoading: productsLoading, error: productsError } = useGetTopProductsQuery({ limit: 3 });

  const renderSection = (title, data, loading, error) => (
    <div className="border rounded-lg p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      
      {loading && <p className="text-blue-600">Loading...</p>}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <p className="text-red-600 font-semibold">Error:</p>
          <pre className="text-xs mt-2 overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}
      
      {data && (
        <div className="bg-green-50 border border-green-200 rounded p-3">
          <p className="text-green-600 font-semibold mb-2">✓ Data Loaded</p>
          {showRaw && (
            <pre className="text-xs overflow-auto max-h-64 bg-white p-2 rounded">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard API Test</h1>
        <p className="text-gray-600">Testing seller dashboard API endpoints</p>
        
        <div className="mt-4 flex gap-4">
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showRaw ? 'Hide' : 'Show'} Raw Data
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Auth Token:</span>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              {localStorage.getItem('auth_token') ? '✓ Present' : '✗ Missing'}
            </code>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {renderSection('Statistics API', stats, statsLoading, statsError)}
        {renderSection('Recent Orders API', orders, ordersLoading, ordersError)}
        {renderSection('Top Products API', products, productsLoading, productsError)}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold mb-2">Quick Checks:</h3>
        <ul className="space-y-1 text-sm">
          <li>✓ Backend URL: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}</li>
          <li>✓ Auth Token: {localStorage.getItem('auth_token') ? 'Present' : 'Missing'}</li>
          <li>✓ Redux Store: {window.store ? 'Connected' : 'Not found'}</li>
        </ul>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold mb-2">Manual API Test:</h3>
        <button
          onClick={async () => {
            try {
              const response = await fetch('http://localhost:3000/api/seller/statistics', {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
              });
              const data = await response.json();
              console.log('Manual API Test Result:', data);
              alert('Check console for result');
            } catch (err) {
              console.error('Manual API Test Error:', err);
              alert('Error: ' + err.message);
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Statistics API Manually
        </button>
      </div>
    </div>
  );
}
