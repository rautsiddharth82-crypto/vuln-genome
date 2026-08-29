import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, ShieldCheck, ShieldAlert, BarChart3 } from 'lucide-react';

type TimeRange = '7D' | '30D' | '90D' | '1Y';

export const TrendChart: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [range, setRange] = useState<TimeRange>('30D');
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    found: number;
    fixed: number;
    critical: number;
    x: number;
    y: number;
  } | null>(null);

  // Generate dataset based on range
  const getData = (r: TimeRange) => {
    switch (r) {
      case '7D':
        return [
          { label: 'Mon', found: 4, fixed: 4, critical: 1 },
          { label: 'Tue', found: 6, fixed: 5, critical: 2 },
          { label: 'Wed', found: 3, fixed: 3, critical: 0 },
          { label: 'Thu', found: 8, fixed: 7, critical: 2 },
          { label: 'Fri', found: 5, fixed: 5, critical: 1 },
          { label: 'Sat', found: 2, fixed: 2, critical: 0 },
          { label: 'Sun', found: 1, fixed: 1, critical: 0 },
        ];
      case '90D':
        return [
          { label: 'Jun W1', found: 18, fixed: 16, critical: 5 },
          { label: 'Jun W3', found: 22, fixed: 20, critical: 6 },
          { label: 'Jul W1', found: 14, fixed: 14, critical: 3 },
          { label: 'Jul W3', found: 28, fixed: 26, critical: 7 },
          { label: 'Aug W1', found: 19, fixed: 18, critical: 4 },
          { label: 'Aug W3', found: 12, fixed: 12, critical: 2 },
        ];
      case '1Y':
        return [
          { label: 'Q3 25', found: 64, fixed: 58, critical: 16 },
          { label: 'Q4 25', found: 82, fixed: 79, critical: 21 },
          { label: 'Q1 26', found: 54, fixed: 52, critical: 11 },
          { label: 'Q2 26', found: 41, fixed: 40, critical: 8 },
          { label: 'Q3 26', found: 32, fixed: 31, critical: 4 },
        ];
      case '30D':
      default:
        return [
          { label: 'Aug 01', found: 8, fixed: 7, critical: 2 },
          { label: 'Aug 05', found: 12, fixed: 11, critical: 3 },
          { label: 'Aug 10', found: 6, fixed: 6, critical: 1 },
          { label: 'Aug 15', found: 15, fixed: 14, critical: 4 },
          { label: 'Aug 20', found: 9, fixed: 9, critical: 2 },
          { label: 'Aug 24', found: 4, fixed: 4, critical: 1 },
        ];
    }
  };

  const data = getData(range);
  const maxVal = Math.max(...data.map((d) => Math.max(d.found, d.fixed, d.critical * 2)), 10) * 1.2;

  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Calculate coordinates
  const pointsFound = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const y = height - paddingY - (d.found / maxVal) * chartHeight;
    return { x, y, ...d };
  });

  const pointsFixed = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const y = height - paddingY - (d.fixed / maxVal) * chartHeight;
    return { x, y, ...d };
  });

  const pointsCritical = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const y = height - paddingY - ((d.critical * 2.5) / maxVal) * chartHeight;
    return { x, y, ...d };
  });

  const makePath = (pts: { x: number; y: number }[]) => {
    return pts.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`), '');
  };

  return (
    <div className={`p-6 rounded-2xl bg-[#FFFDF9] border border-[#DCC7AE]/70 shadow-sm flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#5A3825]">
            <BarChart3 className="w-4 h-4 text-[#B88A52]" />
            Vulnerability Trend & Velocity Index
          </div>
          <h4 className="text-base font-bold font-display text-[#24150F] mt-0.5">
            Detection vs. Remediation Convergence
          </h4>
        </div>

        {/* Time range buttons */}
        <div className="flex items-center p-1 rounded-xl bg-[#F5EBDD] border border-[#DCC7AE]">
          {(['7D', '30D', '90D', '1Y'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all ${
                range === r
                  ? 'bg-[#3B2418] text-[#FFF9F0] shadow-xs'
                  : 'text-[#5A3825] hover:text-[#24150F]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 text-xs mb-2">
        <div className="flex items-center gap-1.5 font-semibold text-[#5A3825]">
          <span className="w-3 h-3 rounded-full bg-[#B88A52]" />
          <span>Vulnerabilities Found</span>
        </div>
        <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
          <span className="w-3 h-3 rounded-full bg-emerald-600" />
          <span>Fixed & Certified</span>
        </div>
        <div className="flex items-center gap-1.5 font-semibold text-red-700">
          <span className="w-3 h-3 rounded-full bg-red-600" />
          <span>Critical Severity</span>
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          {/* Horizontal Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1={paddingX}
              y1={height - paddingY - ratio * chartHeight}
              x2={width - paddingX}
              y2={height - paddingY - ratio * chartHeight}
              stroke="#DCC7AE"
              strokeDasharray="4 4"
              strokeOpacity="0.4"
            />
          ))}

          {/* Lines */}
          <path
            d={makePath(pointsFound)}
            fill="none"
            stroke="#B88A52"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={makePath(pointsFixed)}
            fill="none"
            stroke="#059669"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={makePath(pointsCritical)}
            fill="none"
            stroke="#DC2626"
            strokeWidth="2.5"
            strokeDasharray="6 3"
            strokeLinecap="round"
          />

          {/* Interactive Data Points */}
          {pointsFound.map((pt, idx) => (
            <g key={idx}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="5"
                fill="#FFFDF9"
                stroke="#B88A52"
                strokeWidth="2.5"
                className="cursor-pointer transition-all hover:r-7"
                onMouseEnter={() =>
                  setHoveredPoint({
                    date: pt.label,
                    found: pt.found,
                    fixed: pt.fixed,
                    critical: pt.critical,
                    x: pt.x,
                    y: pt.y,
                  })
                }
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <circle
                cx={pointsFixed[idx].x}
                cy={pointsFixed[idx].y}
                r="5"
                fill="#FFFDF9"
                stroke="#059669"
                strokeWidth="2.5"
                className="cursor-pointer transition-all hover:r-7"
                onMouseEnter={() =>
                  setHoveredPoint({
                    date: pt.label,
                    found: pt.found,
                    fixed: pt.fixed,
                    critical: pt.critical,
                    x: pointsFixed[idx].x,
                    y: pointsFixed[idx].y,
                  })
                }
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          ))}

          {/* X Axis Labels */}
          {data.map((d, i) => {
            const x = paddingX + (i / (data.length - 1)) * chartWidth;
            return (
              <text
                key={i}
                x={x}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] font-mono fill-[#5A3825]/80 font-bold"
              >
                {d.label}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none p-3 rounded-xl bg-[#24150F] text-[#FFF9F0] border border-[#B88A52] shadow-xl text-xs font-mono"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100 - 30}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="font-bold text-[#B88A52] border-b border-[#5A3825] pb-1 mb-1.5">
              {hoveredPoint.date}
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="text-amber-200">Found: {hoveredPoint.found}</div>
              <div className="text-emerald-400">Fixed: {hoveredPoint.fixed}</div>
              <div className="text-red-400">Critical: {hoveredPoint.critical}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
