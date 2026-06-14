type Status = 'open' | 'in_progress' | 'closed';

const statusConfig: Record<Status, { label: string; className: string }> = {
  open: { label: 'Åben', className: 'bg-[#dcfce7] text-[#166534]' },
  in_progress: { label: 'I gang', className: 'bg-[#fef9c3] text-[#854d0e]' },
  closed: { label: 'Lukket', className: 'bg-[#f3f4f6] text-[#374151]' },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] ?? statusConfig.closed;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
