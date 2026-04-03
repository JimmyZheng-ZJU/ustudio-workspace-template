import React from 'react';

interface LineChartProps {
  data: { label: string; value: number }[];
  width?: number;
  height?: number;
  color?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 400,
  height = 200,
  color = '#4fc3f7',
}) => {
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const gridLines = 5;
  const yTicks = Array.from({ length: gridLines + 1 }, (_, i) => {
    const ratio = i / gridLines;
    return {
      value: maxValue * (1 - ratio),
      y: ratio * chartHeight,
    };
  });

  // X spacing: evenly distribute across chartWidth
  const xStep = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth / 2;

  const points = data.map((d, i) => ({
    x: data.length > 1 ? i * xStep : chartWidth / 2,
    y: chartHeight - (d.value / maxValue) * chartHeight,
    label: d.label,
    value: d.value,
  }));

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Area polygon: line points + bottom-right + bottom-left corners
  const areaPolygonPoints = [
    ...points.map((p) => `${p.x},${p.y}`),
    `${points[points.length - 1].x},${chartHeight}`,
    `${points[0].x},${chartHeight}`,
  ].join(' ');

  return (
    <svg
      width={width}
      height={height}
      style={{ display: 'block', background: 'transparent' }}
    >
      <g transform={`translate(${padding.left}, ${padding.top})`}>
        {/* Grid lines + Y-axis labels */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={0}
              y1={tick.y}
              x2={chartWidth}
              y2={tick.y}
              stroke="#333"
              strokeWidth={1}
            />
            <text
              x={-6}
              y={tick.y}
              textAnchor="end"
              dominantBaseline="middle"
              style={{ fontSize: 10, fill: '#888', fontFamily: 'sans-serif' }}
            >
              {Number.isInteger(tick.value)
                ? tick.value
                : tick.value.toFixed(1)}
            </text>
          </g>
        ))}

        {/* Area fill */}
        {points.length >= 2 && (
          <polygon
            points={areaPolygonPoints}
            fill={color}
            fillOpacity={0.1}
            stroke="none"
          />
        )}

        {/* Line */}
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data point circles */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />
        ))}

        {/* X-axis labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={chartHeight + 16}
            textAnchor="middle"
            style={{ fontSize: 10, fill: '#888', fontFamily: 'sans-serif' }}
            transform={
              p.label.length > 6
                ? `rotate(-30, ${p.x}, ${chartHeight + 16})`
                : undefined
            }
          >
            {p.label}
          </text>
        ))}

        {/* Axes */}
        <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#444" strokeWidth={1} />
        <line
          x1={0}
          y1={chartHeight}
          x2={chartWidth}
          y2={chartHeight}
          stroke="#444"
          strokeWidth={1}
        />
      </g>
    </svg>
  );
};

export default LineChart;
