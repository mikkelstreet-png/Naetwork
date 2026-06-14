interface StatusBadgeProps {
  status: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: { label: 'Afventer', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
  confirmed: { label: 'Bekraeftet', className: 'bg-green-50 text-green-700 border border-green-200' },
  completed: { label: 'Gennemfoert', className: 'bg-blue-50 text-blue-700 border border-blue-200' },
  cancelled: { label: 'Annulleret', className: 'bg-gray-50 text-gray-500 border border-gray-200' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.className}`}>
      {config.label}
    </span>
  );
}
