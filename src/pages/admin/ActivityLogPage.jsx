//aduit log == activity log
import React, { useState } from 'react';
import { 
  Search, Filter, Calendar, Download, RefreshCw, AlertCircle, 
  Eye, TrendingUp, Shield, Activity 
} from 'lucide-react';
import { 
  useGetAllAuditLogsQuery, 
  useGetLogStatisticsQuery,
  useExportLogsMutation 
} from '../../features/AuditLog/auditLogApi';
import Button from '../../ui/Button';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function ActivityLogsPage() {
  usePageTitle('Activity Log');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    actor_type: '',
    severity: '',
    search: '',
    start_date: '',
    end_date: '',
  });
  const [detailsModal, setDetailsModal] = useState(null);

  // Fetch logs and statistics
  const { data: logsData, isLoading, error, refetch } = useGetAllAuditLogsQuery(filters);
  const { data: statsData } = useGetLogStatisticsQuery();

  // Export mutation
  const [exportLogs, { isLoading: isExporting }] = useExportLogsMutation();

  // Extract data
  const logs = logsData?.data || [];
  const pagination = logsData?.pagination || {};
  const stats = statsData?.data || {};

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    const colors = {
      'info': 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
      'warning': 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
      'critical': 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
    };
    return colors[severity?.toLowerCase()] || colors.info;
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'success': 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
      'failed': 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
      'warning': 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    };
    return colors[status?.toLowerCase()] || colors.success;
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page on filter change
    }));
  };

  // Handle page change
  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle export
  const handleExport = async () => {
    try {
      const blob = await exportLogs({
        format: 'csv',
        start_date: filters.start_date,
        end_date: filters.end_date,
        filters: {
          actor_type: filters.actor_type,
          severity: filters.severity,
        },
      }).unwrap();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export logs');
    }
  };

  // Filter options
  const actorTypes = ['admin', 'seller', 'buyer', 'system'];
  const severityTypes = ['info', 'warning', 'critical'];

  // Pagination
  const totalPages = Math.ceil((pagination.total || 0) / filters.limit);

  // Loading state
  if (isLoading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin text-[#568F87]" size={48} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-[#EF4444]" size={48} />
          <h3 className="text-[#1A1A1A] mb-2">Failed to load activity logs</h3>
          <p className="text-[#666666] mb-4">{error?.data?.message || 'Something went wrong'}</p>
          <Button onClick={() => refetch()}>
            <RefreshCw size={18} />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[#1A1A1A] mb-2">Activity Logs</h1>
          <p className="text-[#666666]">Monitor all system activities and user actions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw size={18} />
            Refresh
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download size={18} />
            {isExporting ? 'Exporting...' : 'Export Logs'}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#666666]">Total Logs</p>
            <Activity className="text-[#568F87]" size={20} />
          </div>
          <p className="text-[#064232] text-3xl font-bold">{stats.total_logs || 0}</p>
          <p className="text-[#666666] text-sm mt-1">Today: {stats.today_logs || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#666666]">Success Rate</p>
            <TrendingUp className="text-[#10B981]" size={20} />
          </div>
          <p className="text-[#10B981] text-3xl font-bold">
            {stats.total_logs ? Math.round((stats.success_count / stats.total_logs) * 100) : 0}%
          </p>
          <p className="text-[#666666] text-sm mt-1">{stats.success_count || 0} successful</p>
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#666666]">Security Alerts</p>
            <Shield className="text-[#EF4444]" size={20} />
          </div>
          <p className="text-[#EF4444] text-3xl font-bold">{stats.security_alerts || 0}</p>
          <p className="text-[#666666] text-sm mt-1">Critical events</p>
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#666666]">This Week</p>
            <Calendar className="text-[#568F87]" size={20} />
          </div>
          <p className="text-[#568F87] text-3xl font-bold">{stats.this_week_logs || 0}</p>
          <p className="text-[#666666] text-sm mt-1">Last 7 days</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" size={20} />
            <input
              type="text"
              placeholder="Search logs..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
            />
          </div>

          {/* Actor Type */}
          <select
            value={filters.actor_type}
            onChange={(e) => handleFilterChange('actor_type', e.target.value)}
            className="px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
          >
            <option value="">All Actor Types</option>
            {actorTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          {/* Severity */}
          <select
            value={filters.severity}
            onChange={(e) => handleFilterChange('severity', e.target.value)}
            className="px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
          >
            <option value="">All Severities</option>
            {severityTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          {/* Date Range */}
          <div className="flex gap-2">
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              className="flex-1 px-3 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
            />
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              className="flex-1 px-3 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
            />
          </div>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] overflow-hidden">
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="mx-auto mb-4 text-[#E5E5E5]" size={64} />
            <h3 className="text-[#1A1A1A] mb-2">No activity logs found</h3>
            <p className="text-[#666666]">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#064232] text-white">
                  <tr>
                    <th className="text-left px-6 py-4">Timestamp</th>
                    <th className="text-left px-6 py-4">Actor</th>
                    <th className="text-left px-6 py-4">Action</th>
                    <th className="text-left px-6 py-4">Entity</th>
                    <th className="text-left px-6 py-4">IP Address</th>
                    <th className="text-left px-6 py-4">Status</th>
                    <th className="text-left px-6 py-4">Severity</th>
                    <th className="text-left px-6 py-4">Actions</th>
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
                      <td className="px-6 py-4 text-[#666666] text-sm">
                        {formatDate(log.created_at)}
                        {log.time_ago && (
                          <p className="text-xs text-[#999999]">{log.time_ago}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-[#1A1A1A] font-medium">{log.actor_name || 'Unknown'}</p>
                          <p className="text-xs text-[#666666]">{log.actor_type || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-[#1A1A1A]">{log.action_label || log.action}</p>
                          {log.action_group && (
                            <p className="text-xs text-[#666666]">{log.action_group}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-[#1A1A1A]">{log.entity_name || `ID: ${log.entity_id}`}</p>
                          <p className="text-xs text-[#666666]">{log.entity_type || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#666666] text-sm font-mono">
                        {log.ip_address || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getStatusColor(log.status)}`}>
                          {log.status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(log.severity)}`}>
                          {log.severity || 'info'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setDetailsModal(log)}
                          className="p-2 text-[#568F87] hover:bg-[#568F87]/10 rounded transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E5E5]">
                <p className="text-[#666666]">
                  Showing {Math.min((filters.page - 1) * filters.limit + 1, pagination.total)} to{' '}
                  {Math.min(filters.page * filters.limit, pagination.total)} of {pagination.total} logs
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded ${
                          filters.page === page
                            ? 'bg-[#064232] text-white'
                            : 'border border-[#E5E5E5] text-[#666666] hover:bg-[#FFF5F2]'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === totalPages}
                    className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Modal */}
      {detailsModal && (
        <LogDetailsModal
          log={detailsModal}
          onClose={() => setDetailsModal(null)}
          formatDate={formatDate}
          getSeverityColor={getSeverityColor}
          getStatusColor={getStatusColor}
        />
      )}
    </div>
  );
}

// Log Details Modal Component
function LogDetailsModal({ log, onClose, formatDate, getSeverityColor, getStatusColor }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-[#064232] text-white px-6 py-4 rounded-t-lg flex items-center justify-between sticky top-0">
          <h3>Activity Log Details</h3>
          <button onClick={onClose} className="text-white hover:text-[#F5BABB]">✕</button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Status and Severity */}
          <div className="flex gap-4">
            <div className="flex-1 p-4 bg-[#FFF5F2] rounded-lg">
              <p className="text-[#666666] mb-2">Status</p>
              <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium border ${getStatusColor(log.status)}`}>
                {log.status || 'N/A'}
              </span>
            </div>
            <div className="flex-1 p-4 bg-[#FFF5F2] rounded-lg">
              <p className="text-[#666666] mb-2">Severity</p>
              <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium border ${getSeverityColor(log.severity)}`}>
                {log.severity || 'info'}
              </span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[#666666] mb-1">Timestamp</p>
              <p className="text-[#1A1A1A]">{formatDate(log.created_at)}</p>
            </div>
            <div>
              <p className="text-[#666666] mb-1">Log ID</p>
              <p className="text-[#1A1A1A]">#{log.id}</p>
            </div>
          </div>

          {/* Actor Information */}
          <div>
            <h4 className="text-[#1A1A1A] mb-3">Actor Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[#666666] mb-1">Actor Name</p>
                <p className="text-[#1A1A1A]">{log.actor_name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-[#666666] mb-1">Actor Type</p>
                <p className="text-[#1A1A1A]">{log.actor_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#666666] mb-1">Actor ID</p>
                <p className="text-[#1A1A1A]">#{log.actor_id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#666666] mb-1">IP Address</p>
                <p className="text-[#1A1A1A] font-mono">{log.ip_address || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Action Information */}
          <div>
            <h4 className="text-[#1A1A1A] mb-3">Action Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[#666666] mb-1">Action</p>
                <p className="text-[#1A1A1A]">{log.action_label || log.action}</p>
              </div>
              <div>
                <p className="text-[#666666] mb-1">Action Group</p>
                <p className="text-[#1A1A1A]">{log.action_group || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#666666] mb-1">Category</p>
                <p className="text-[#1A1A1A]">{log.category || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Entity Information */}
          <div>
            <h4 className="text-[#1A1A1A] mb-3">Entity Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[#666666] mb-1">Entity Name</p>
                <p className="text-[#1A1A1A]">{log.entity_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#666666] mb-1">Entity Type</p>
                <p className="text-[#1A1A1A]">{log.entity_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#666666] mb-1">Entity ID</p>
                <p className="text-[#1A1A1A]">#{log.entity_id || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {log.description && (
            <div className="p-4 bg-[#FFF5F2] rounded-lg">
              <p className="text-[#666666] mb-2">Description</p>
              <p className="text-[#1A1A1A]">{log.description}</p>
            </div>
          )}

          {/* Changes (if available) */}
          {(log.old_value || log.new_value) && (
            <div>
              <h4 className="text-[#1A1A1A] mb-3">Data Changes</h4>
              <div className="grid grid-cols-2 gap-4">
                {log.old_value && (
                  <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
                    <p className="text-[#666666] mb-2">Old Value</p>
                    <pre className="text-[#1A1A1A] text-sm overflow-x-auto">
                      {JSON.stringify(JSON.parse(log.old_value || '{}'), null, 2)}
                    </pre>
                  </div>
                )}
                {log.new_value && (
                  <div className="p-4 bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg">
                    <p className="text-[#666666] mb-2">New Value</p>
                    <pre className="text-[#1A1A1A] text-sm overflow-x-auto">
                      {JSON.stringify(JSON.parse(log.new_value || '{}'), null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Close Button */}
          <Button variant="outline" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}