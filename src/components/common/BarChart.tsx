import React from 'react';

interface BarChartProps {
  data: { label: string; value: number }[];
  width?: number;
  height?: number;
  color?: string;
}

const BarChart: React.FC<BarChartProps> = ({
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

  const barWidth = (chartWidth / data.length) * 0.6;
  const barSpacing = chartWidth / data.length;

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

        {/* Bars + value labels + X-axis labels */}
        {data.map((d, i) => {
          const barHeight = (d.value / maxValue) * chartHeight;
          const x = i * barSpacing + (barSpacing - barWidth) / 2;
          const y = chartHeight - barHeight;
          const cx = i * barSpacing + barSpacing / 2;

          return (
            <g key={i}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx={2}
              />
              {/* Value label */}
              <text
                x={cx}
                y={y - 4}
                textAnchor="middle"
                style={{ fontSize: 10, fill: '#aaa', fontFamily: 'sans-serif' }}
              >
                {d.value}
              </text>
              {/* X-axis label */}
              <text
                x={cx}
                y={chartHeight + 16}
                textAnchor="middle"
                style={{ fontSize: 10, fill: '#888', fontFamily: 'sans-serif' }}
                transform={
                  d.label.length > 6
                    ? `rotate(-30, ${cx}, ${chartHeight + 16})`
                    : undefined
                }
              >
                {d.label}
              </text>
            </g>
          );
        })}

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

export default BarChart;
