import React from 'react';

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  width?: number;
  height?: number;
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutSlicePath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number
): string {
  // Clamp to avoid full-circle degenerate arc
  const sweep = endAngle - startAngle;
  const clampedEnd = sweep >= 360 ? startAngle + 359.9999 : endAngle;
  const largeArc = clampedEnd - startAngle > 180 ? 1 : 0;

  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, clampedEnd);
  const innerStart = polarToCartesian(cx, cy, innerR, clampedEnd);
  const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
    'Z',
  ].join(' ');
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  width = 200,
  height = 200,
}) => {
  const cx = width / 2;
  const cy = height / 2 - 20;
  const outerR = 70;
  const innerR = 40;

  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  // Compute slices
  let cumAngle = 0;
  const slices = data.map((d) => {
    const angleDeg = (d.value / total) * 360;
    const startAngle = cumAngle;
    const endAngle = cumAngle + angleDeg;
    cumAngle = endAngle;
    return { ...d, startAngle, endAngle, angleDeg };
  });

  const legendTop = cy + outerR + 10;
  const dotR = 5;
  const legendLineHeight = 18;

  return (
    <svg
      width={width}
      height={height}
      style={{ display: 'block', background: 'transparent' }}
    >
      {/* Donut slices */}
      {slices.map((s, i) => (
        <path
          key={i}
          d={donutSlicePath(cx, cy, outerR, innerR, s.startAngle, s.endAngle)}
          fill={s.color}
        />
      ))}

      {/* Total in center */}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: 16,
          fontWeight: 700,
          fill: '#ddd',
          fontFamily: 'sans-serif',
        }}
      >
        {total}
      </text>

      {/* Legend */}
      {slices.map((s, i) => {
        const y = legendTop + i * legendLineHeight;
        const pct = ((s.value / total) * 100).toFixed(1);
        return (
          <g key={i}>
            <circle cx={cx - 60 + dotR} cy={y + dotR / 2} r={dotR} fill={s.color} />
            <text
              x={cx - 60 + dotR * 2 + 4}
              y={y + dotR / 2}
              dominantBaseline="middle"
              style={{ fontSize: 11, fill: '#888', fontFamily: 'sans-serif' }}
            >
              {s.label} ({pct}%)
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default PieChart;
