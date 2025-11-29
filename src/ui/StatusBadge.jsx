import React from 'react';

export default function StatusBadge({ status, type = 'default' }) {
  const getStyles = () => {
    if (type === 'order') {
      const styles = {
        pending: 'bg-[#F5BABB] text-[#064232]',
        processing: 'bg-[#568F87] text-white',
        shipped: 'bg-[#F59E0B] text-white',
        delivered: 'bg-[#10B981] text-white',
        cancelled: 'bg-[#EF4444] text-white',
      };
      return styles[status.toLowerCase()] || styles.pending;
    }

    if (type === 'approval') {
      const styles = {
        pending: 'bg-[#F5BABB] text-[#064232]',
        approved: 'bg-[#10B981] text-white',
        rejected: 'bg-[#EF4444] text-white',
        suspended: 'bg-[#EF4444] text-white',
        active: 'bg-[#10B981] text-white',
      };
      return styles[status.toLowerCase()] || styles.pending;
    }

    if (type === 'stock') {
      const styles = {
        'in stock': 'bg-[#10B981] text-white',
        'low stock': 'bg-[#F59E0B] text-white',
        'out of stock': 'bg-[#EF4444] text-white',
      };
      return styles[status.toLowerCase()] || 'bg-[#E5E5E5] text-[#666666]';
    }

    if (type === 'payment') {
      const styles = {
        paid: 'bg-[#10B981] text-white',
        pending: 'bg-[#F5BABB] text-[#064232]',
        failed: 'bg-[#EF4444] text-white',
        refunded: 'bg-[#666666] text-white',
      };
      return styles[status.toLowerCase()] || styles.pending;
    }

    return 'bg-[#E5E5E5] text-[#666666]';
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${getStyles()}`}>
      {status}
    </span>
  );
}
