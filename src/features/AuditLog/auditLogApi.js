
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const auditLogApi = createApi({
  reducerPath: 'auditLogApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['AuditLogs', 'LogStats'],
  endpoints: (builder) => ({
    // Get all audit logs with filters
    getAllAuditLogs: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        // Add all filter parameters
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.actor_id) queryParams.append('actor_id', params.actor_id);
        if (params.actor_type) queryParams.append('actor_type', params.actor_type);
        if (params.action) queryParams.append('action', params.action);
        if (params.action_group) queryParams.append('action_group', params.action_group);
        if (params.entity_type) queryParams.append('entity_type', params.entity_type);
        if (params.entity_id) queryParams.append('entity_id', params.entity_id);
        if (params.status) queryParams.append('status', params.status);
        if (params.severity) queryParams.append('severity', params.severity);
        if (params.category) queryParams.append('category', params.category);
        if (params.start_date) queryParams.append('start_date', params.start_date);
        if (params.end_date) queryParams.append('end_date', params.end_date);
        if (params.search) queryParams.append('search', params.search);
        if (params.ip) queryParams.append('ip', params.ip);
        
        return `/admin/logs?${queryParams.toString()}`;
      },
      providesTags: ['AuditLogs'],
    }),

    // Get log by ID
    getLogById: builder.query({
      query: (id) => `/admin/logs/detail?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'AuditLogs', id }],
    }),

    // Get actor logs
    getActorLogs: builder.query({
      query: ({ actor_id, actor_type, page = 1, limit = 20 }) => 
        `/admin/logs/actor?actor_id=${actor_id}&actor_type=${actor_type}&page=${page}&limit=${limit}`,
      providesTags: (result, error, { actor_id }) => [{ type: 'AuditLogs', id: `actor_${actor_id}` }],
    }),

    // Get entity history
    getEntityHistory: builder.query({
      query: ({ entity_type, entity_id, page = 1, limit = 20 }) => 
        `/admin/logs/entity?entity_type=${entity_type}&entity_id=${entity_id}&page=${page}&limit=${limit}`,
      providesTags: (result, error, { entity_id }) => [{ type: 'AuditLogs', id: `entity_${entity_id}` }],
    }),

    // Get security logs
    getSecurityLogs: builder.query({
      query: ({ page = 1, limit = 20 }) => `/admin/logs/security?page=${page}&limit=${limit}`,
      providesTags: [{ type: 'AuditLogs', id: 'SECURITY' }],
    }),

    // Get recent activity
    getRecentActivity: builder.query({
      query: (limit = 20) => `/admin/logs/recent?limit=${limit}`,
      providesTags: [{ type: 'AuditLogs', id: 'RECENT' }],
    }),

    // Get statistics
    getLogStatistics: builder.query({
      query: () => '/admin/logs/stats',
      providesTags: ['LogStats'],
    }),

    // Get activity timeline
    getActivityTimeline: builder.query({
      query: ({ start_date, end_date, group_by = 'day' }) => 
        `/admin/logs/timeline?start_date=${start_date}&end_date=${end_date}&group_by=${group_by}`,
      providesTags: ['LogStats'],
    }),

    // Export logs
    exportLogs: builder.mutation({
      query: (body) => ({
        url: '/admin/logs/export',
        method: 'POST',
        body,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Cleanup old logs (Super Admin only)
    cleanupOldLogs: builder.mutation({
      query: (days) => ({
        url: `/admin/logs/cleanup?days=${days}`,
        method: 'POST',
      }),
      invalidatesTags: ['AuditLogs', 'LogStats'],
    }),
  }),
});

export const {
  useGetAllAuditLogsQuery,
  useGetLogByIdQuery,
  useGetActorLogsQuery,
  useGetEntityHistoryQuery,
  useGetSecurityLogsQuery,
  useGetRecentActivityQuery,
  useGetLogStatisticsQuery,
  useGetActivityTimelineQuery,
  useExportLogsMutation,
  useCleanupOldLogsMutation,
} = auditLogApi;