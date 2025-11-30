
import React from 'react';

export default function StatusBadge({ status, type = 'approval' }) {
  const getStatusStyles = () => {
    const normalizedStatus = status?.toLowerCase() || '';

    // Seller approval statuses
    if (type === 'approval') {
      switch (normalizedStatus) {
        case 'approved':
          return {
            bg: 'bg-[#10B981]/10',
            text: 'text-[#10B981]',
            label: 'Approved'
          };
        case 'pending':
          return {
            bg: 'bg-[#F59E0B]/10',
            text: 'text-[#F59E0B]',
            label: 'Pending'
          };
        case 'rejected':
          return {
            bg: 'bg-[#EF4444]/10',
            text: 'text-[#EF4444]',
            label: 'Rejected'
          };
        case 'suspended':
          return {
            bg: 'bg-[#EF4444]/10',
            text: 'text-[#EF4444]',
            label: 'Suspended'
          };
        default:
          return {
            bg: 'bg-[#666666]/10',
            text: 'text-[#666666]',
            label: status || 'Unknown'
          };
      }
    }

    // Buyer statuses
    if (type === 'buyer') {
      switch (normalizedStatus) {
        case 'active':
          return {
            bg: 'bg-[#10B981]/10',
            text: 'text-[#10B981]',
            label: 'Active'
          };
        case 'inactive':
          return {
            bg: 'bg-[#F59E0B]/10',
            text: 'text-[#F59E0B]',
            label: 'Inactive'
          };
        case 'suspended':
          return {
            bg: 'bg-[#EF4444]/10',
            text: 'text-[#EF4444]',
            label: 'Suspended'
          };
        default:
          return {
            bg: 'bg-[#666666]/10',
            text: 'text-[#666666]',
            label: status || 'Unknown'
          };
      }
    }

    // Order statuses
    if (type === 'order') {
      switch (normalizedStatus) {
        case 'delivered':
          return {
            bg: 'bg-[#10B981]/10',
            text: 'text-[#10B981]',
            label: 'Delivered'
          };
        case 'shipped':
          return {
            bg: 'bg-[#568F87]/10',
            text: 'text-[#568F87]',
            label: 'Shipped'
          };
        case 'processing':
          return {
            bg: 'bg-[#F59E0B]/10',
            text: 'text-[#F59E0B]',
            label: 'Processing'
          };
        case 'pending':
          return {
            bg: 'bg-[#F59E0B]/10',
            text: 'text-[#F59E0B]',
            label: 'Pending'
          };
        case 'cancelled':
          return {
            bg: 'bg-[#EF4444]/10',
            text: 'text-[#EF4444]',
            label: 'Cancelled'
          };
        default:
          return {
            bg: 'bg-[#666666]/10',
            text: 'text-[#666666]',
            label: status || 'Unknown'
          };
      }
    }

    // Payment statuses
    if (type === 'payment') {
      switch (normalizedStatus) {
        case 'paid':
        case 'completed':
          return {
            bg: 'bg-[#10B981]/10',
            text: 'text-[#10B981]',
            label: 'Paid'
          };
        case 'pending':
          return {
            bg: 'bg-[#F59E0B]/10',
            text: 'text-[#F59E0B]',
            label: 'Pending'
          };
        case 'failed':
          return {
            bg: 'bg-[#EF4444]/10',
            text: 'text-[#EF4444]',
            label: 'Failed'
          };
        case 'refunded':
          return {
            bg: 'bg-[#568F87]/10',
            text: 'text-[#568F87]',
            label: 'Refunded'
          };
        default:
          return {
            bg: 'bg-[#666666]/10',
            text: 'text-[#666666]',
            label: status || 'Unknown'
          };
      }
    }

    // Default fallback
    return {
      bg: 'bg-[#666666]/10',
      text: 'text-[#666666]',
      label: status || 'Unknown'
    };
  };

  const { bg, text, label } = getStatusStyles();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}