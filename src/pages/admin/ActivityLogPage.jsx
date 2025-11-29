import React, { useState } from 'react';
import { Search, Filter, Calendar, Download } from 'lucide-react';
import StatusBadge from '../../ui/StatusBadge';
import Button from '../../ui/Button';

export default function ActivityLogsPage() {
  const [filterType, setFilterType] = useState('all');

  const logs = [
    {
      id: 1,
      timestamp: '2024-01-30 10:45:32',
      actor: 'Admin John',
      actorType: 'Admin',
      action: 'Approved Seller',
      entity: 'Tech Store Pro',
      entityType: 'Seller',
      ipAddress: '192.168.1.1',
      severity: 'Info',
      details: 'Seller registration approved after document verification',
    },
    {
      id: 2,
      timestamp: '2024-01-30 10:30:15',
      actor: 'Admin Sarah',
      actorType: 'Admin',
      action: 'Updated Product Status',
      entity: 'Wireless Headphones',
      entityType: 'Product',
      ipAddress: '192.168.1.2',
      severity: 'Info',
      details: 'Product status changed from Pending to Approved',
    },
    {
      id: 3,
      timestamp: '2024-01-30 09:15:22',
      actor: 'System',
      actorType: 'System',
      action: 'Failed Login Attempt',
      entity: 'admin@test.com',
      entityType: 'User',
      ipAddress: '203.0.113.0',
      severity: 'Warning',
      details: 'Multiple failed login attempts detected',
    },
    {
      id: 4,
      timestamp: '2024-01-30 08:50:10',
      actor: 'Seller Mike',
      actorType: 'Seller',
      action: 'Created Product',
      entity: 'Smart Watch Pro',
      entityType: 'Product',
      ipAddress: '192.168.1.5',
      severity: 'Info',
      details: 'New product submitted for approval',
    },
    {
      id: 5,
      timestamp: '2024-01-30 08:20:45',
      actor: 'Admin John',
      actorType: 'Admin',
      action: 'Processed Payout',
      entity: 'Fashion Hub',
      entityType: 'Payout',
      ipAddress: '192.168.1.1',
      severity: 'Info',
      details: 'Payout of $3,502 processed successfully',
    },
    {
      id: 6,
      timestamp: '2024-01-29 18:30:00',
      actor: 'System',
      actorType: 'System',
      action: 'Database Backup',
      entity: 'Full Backup',
      entityType: 'System',
      ipAddress: 'localhost',
      severity: 'Info',
      details: 'Automated daily backup completed successfully',
    },
    {
      id: 7,
      timestamp: '2024-01-29 16:45:30',
      actor: 'Admin Sarah',
      actorType: 'Admin',
      action: 'Updated Settings',
      entity: 'Commission Rate',
      entityType: 'Settings',
      ipAddress: '192.168.1.2',
      severity: 'Warning',
      details: 'Default commission rate changed from 10% to 12%',
    },
    {
      id: 8,
      timestamp: '2024-01-29 15:20:18',
      actor: 'Buyer Emma',
      actorType: 'Buyer',
      action: 'Placed Order',
      entity: 'Order #12345',
      entityType: 'Order',
      ipAddress: '198.51.100.1',
      severity: 'Info',
      details: 'Order placed for $299.00 with 3 items',
    },
  ];

  const actorTypes = ['all', 'Admin', 'Seller', 'Buyer', 'System'];
  const severityTypes = ['all', 'Info', 'Warning', 'Critical'];

  const getSeverityColor = (severity) => {
    const colors = {
      'Info': 'text-[#10B981] bg-[#10B981]/10',
      'Warning': 'text-[#F59E0B] bg-[#F59E0B]/10',
      'Critical': 'text-[#EF4444] bg-[#EF4444]/10',
    };
    return colors[severity] || colors.Info;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[#1A1A1A] mb-2">Activity Logs</h1>
          <p className="text-[#666666]">Monitor all system activities and user actions</p>
        </div>
        <Button variant="secondary">
          <Download size={18} />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" size={20} />
            <input
              type="text"
              placeholder="Search logs..."
              className="w-full pl-10 pr-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
          >
            <option value="all">All Actor Types</option>
            {actorTypes.slice(1).map(type => (
              <option key={type} value={type.toLowerCase()}>{type}</option>
            ))}
          </select>
          <select
            className="px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
          >
            <option value="all">All Severities</option>
            {severityTypes.slice(1).map(type => (
              <option key={type} value={type.toLowerCase()}>{type}</option>
            ))}
          </select>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E5E5] rounded-md hover:bg-[#FFF5F2] transition-colors text-[#666666]">
            <Calendar size={18} />
            Date Range
          </button>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#064232] text-white">
              <tr>
                <th className="text-left px-6 py-4">Timestamp</th>
                <th className="text-left px-6 py-4">Actor</th>
                <th className="text-left px-6 py-4">Action</th>
                <th className="text-left px-6 py-4">Entity</th>
                <th className="text-left px-6 py-4">IP Address</th>
                <th className="text-left px-6 py-4">Severity</th>
                <th className="text-left px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr 
                  key={log.id}
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#FFF5F2]/30'
                  } hover:bg-[#F5BABB]/20 transition-colors`}
                >
                  <td className="px-6 py-4 text-[#666666] text-sm">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-[#1A1A1A]">{log.actor}</p>
                      <p className="text-xs text-[#666666]">{log.actorType}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#1A1A1A]">{log.action}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-[#1A1A1A]">{log.entity}</p>
                      <p className="text-xs text-[#666666]">{log.entityType}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#666666] text-sm">{log.ipAddress}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#666666] text-sm max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E5E5]">
          <p className="text-[#666666]">Showing {logs.length} of {logs.length} logs</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2]">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#064232] text-white rounded">1</button>
            <button className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2]">2</button>
            <button className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2]">3</button>
            <button className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2]">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
