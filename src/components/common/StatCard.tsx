import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: number;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  trend,
  color = '#7aadff',
}) => {
  const trendPositive = trend !== undefined && trend >= 0;
  const trendColor = trendPositive ? '#4ddb8a' : '#ff6b6b';
  const trendIcon = trendPositive ? '↑' : '↓';
  const trendAbs = trend !== undefined ? Math.abs(trend) : 0;

  return (
    <div
      style={{
        background: 'rgba(10,15,28,0.88)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 8,
        padding: 16,
        minWidth: 140,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Value row */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span
          style={{
            fontSize: 28,
            fontWeight: 700,
            color,
            lineHeight: 1.1,
            letterSpacing: '-0.5px',
          }}
        >
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: 14, color: '#888', fontWeight: 400 }}>{unit}</span>
        )}
      </div>

      {/* Title */}
      <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{title}</div>

      {/* Trend */}
      {trend !== undefined && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            marginTop: 6,
            background: `${trendColor}1a`,
            borderRadius: 4,
            padding: '1px 6px',
          }}
        >
          <span style={{ fontSize: 11, color: trendColor, fontWeight: 700 }}>
            {trendIcon} {trendAbs}%
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
