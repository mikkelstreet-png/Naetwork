interface StatusBadgeProps {
  status: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  requested: { label: 'Anmodet', className: 'bg-gray-950 text-white border border-gray-950' },
  pending: { label: 'Afventer', className: 'bg-gray-100 text-gray-700 border border-gray-200' },
  confirmed: { label: 'Bekræftet', className: 'bg-emerald-50 text-emerald-800 border border-emerald-200' },
  rescheduled: { label: 'Omplanlagt', className: 'bg-cyan-50 text-cyan-800 border border-cyan-200' },
  completed: { label: 'Gennemført', className: 'bg-blue-50 text-blue-800 border border-blue-200' },
  cancelled: { label: 'Annulleret', className: 'bg-red-50 text-red-700 border border-red-200' },
  no_show: { label: 'Udeblivelse', className: 'bg-red-50 text-red-700 border border-red-200' },
  refunded: { label: 'Refunderet', className: 'bg-gray-50 text-gray-500 border border-gray-200' },
  disputed: { label: 'Tvist', className: 'bg-red-50 text-red-700 border border-red-200' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}
