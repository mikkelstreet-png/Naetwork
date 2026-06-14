type Status = 'open' | 'in_progress' | 'closed';

const statusConfig: Record<Status, { label: string; className: string }> = {
  open: { label: 'Åben', className: 'bg-[#0a0a0a] text-white' },
  in_progress: { label: 'I gang', className: 'bg-gray-200 text-gray-700' },
  closed: { label: 'Lukket', className: 'bg-gray-100 text-gray-500' },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] ?? statusConfig.closed;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
