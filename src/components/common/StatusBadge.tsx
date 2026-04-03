import React from 'react';

interface StatusBadgeProps {
  status: string;
  statusMap: Record<string, { label: string; color: string }>;
}

const DEFAULT_CONFIG = { label: 'Unknown', color: '#888888' };

const hexToRgba = (hex: string, alpha: number): string => {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(136,136,136,${alpha})`;
  return `rgba(${r},${g},${b},${alpha})`;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, statusMap }) => {
  const config = statusMap[status] ?? DEFAULT_CONFIG;
  const { label, color } = config;

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        color,
        background: hexToRgba(color, 0.2),
        border: `1px solid ${hexToRgba(color, 0.3)}`,
        letterSpacing: '0.3px',
        whiteSpace: 'nowrap',
        lineHeight: '18px',
      }}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
