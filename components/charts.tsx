"use client";

import React from "react";
import { Star, BarChart3 } from "lucide-react";

interface RadarProps {
  kpi?: number;          // 0-100
  pilotScore?: number;   // 0-100
  replication?: number;  // 0-100
  costEfficiency?: number;// 0-100
  scalability?: number;  // 0-100
  className?: string;
  title?: string;
}

export function SolutionPerformanceRadar({
  kpi = 92,
  pilotScore = 86,
  replication = 82,
  costEfficiency = 78,
  scalability = 88,
  className = "",
  title = "Solution Performance Radar",
}: RadarProps) {
  // Center of 340x300 canvas
  const cx = 170;
  const cy = 145;
  const maxR = 90;

  // 5 axes angles (starting from top, clockwise: -90, -18, 54, 126, 198 degrees)
  const angles = [
    -Math.PI / 2,                  // Top: KPI Achievement
    -Math.PI / 2 + (2 * Math.PI) / 5,     // Top-Right: Pilot Score
    -Math.PI / 2 + (4 * Math.PI) / 5,     // Bottom-Right: Replication Potential
    -Math.PI / 2 + (6 * Math.PI) / 5,     // Bottom-Left: Cost Efficiency
    -Math.PI / 2 + (8 * Math.PI) / 5,     // Top-Left: Scalability
  ];

  const labels = [
    { text: "KPI Achievement", x: cx, y: cy - maxR - 14, anchor: "middle" },
    { text: "Pilot Score", x: cx + maxR + 18, y: cy - 10, anchor: "start" },
    { text: "Replication Potential", x: cx + maxR * 0.7, y: cy + maxR + 18, anchor: "middle" },
    { text: "Cost Efficiency", x: cx - maxR * 0.7, y: cy + maxR + 18, anchor: "middle" },
    { text: "Scalability", x: cx - maxR - 18, y: cy - 10, anchor: "end" },
  ];

  // Grid levels: 20%, 40%, 60%, 80%, 100%
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getPolygonPoints = (level: number) => {
    return angles
      .map((a) => {
        const x = cx + maxR * level * Math.cos(a);
        const y = cy + maxR * level * Math.sin(a);
        return `${x},${y}`;
      })
      .join(" ");
  };

  // Values normalized (0-1)
  const values = [
    Math.min(Math.max(kpi, 10), 100) / 100,
    Math.min(Math.max(pilotScore, 10), 100) / 100,
    Math.min(Math.max(replication, 10), 100) / 100,
    Math.min(Math.max(costEfficiency, 10), 100) / 100,
    Math.min(Math.max(scalability, 10), 100) / 100,
  ];

  const dataPoints = angles
    .map((a, i) => {
      const x = cx + maxR * values[i] * Math.cos(a);
      const y = cy + maxR * values[i] * Math.sin(a);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Star size={18} className="text-amber-500 fill-amber-400" />
        <h4 className="font-heading font-bold text-gov-navy text-base">{title}</h4>
      </div>

      <div className="w-full flex items-center justify-center overflow-x-auto">
        <svg viewBox="0 0 340 280" className="w-full max-w-[340px] h-[280px]">
          {/* Concentric Grid Webs */}
          {gridLevels.map((lvl) => (
            <polygon
              key={lvl}
              points={getPolygonPoints(lvl)}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="1.2"
            />
          ))}

          {/* Radial Spokes */}
          {angles.map((a, i) => {
            const x = cx + maxR * Math.cos(a);
            const y = cy + maxR * Math.sin(a);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
            );
          })}

          {/* Data Polygon */}
          <polygon
            points={dataPoints}
            fill="#10B981"
            fillOpacity="0.28"
            stroke="#10B981"
            strokeWidth="2.2"
            className="transition-all duration-700"
          />

          {/* Data Vertex Dots */}
          {angles.map((a, i) => {
            const x = cx + maxR * values[i] * Math.cos(a);
            const y = cy + maxR * values[i] * Math.sin(a);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3.5"
                fill="#10B981"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Labels */}
          {labels.map((lbl, i) => (
            <text
              key={i}
              x={lbl.x}
              y={lbl.y}
              textAnchor={lbl.anchor as "middle" | "start" | "end"}
              className="text-[11px] font-semibold fill-slate-600 select-none"
            >
              {lbl.text}
            </text>
          ))}
        </svg>
      </div>

      <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100 mt-1">
        <span>KPI: <strong className="text-emerald-600">{kpi}%</strong></span>
        <span>Score: <strong className="text-emerald-600">{pilotScore}%</strong></span>
        <span>Scale: <strong className="text-emerald-600">{scalability}%</strong></span>
        <span>Cost ROI: <strong className="text-emerald-600">{costEfficiency}%</strong></span>
      </div>
    </div>
  );
}

interface PilotProgressProps {
  pilots?: { name: string; progress: number }[];
  className?: string;
}

export function SandboxPilotProgressOverview({
  pilots = [
    { name: "ChainGuard", progress: 75 },
    { name: "HealthPredict", progress: 85 },
  ],
  className = "",
}: PilotProgressProps) {
  const yTicks = [100, 75, 50, 25, 0];
  const chartHeight = 160;
  const chartWidth = 340;
  const paddingLeft = 45;
  const paddingBottom = 30;

  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={18} className="text-[#2563EB]" />
        <h4 className="font-heading font-bold text-gov-navy text-base">Sandbox Pilot Progress Overview</h4>
      </div>

      <div className="w-full flex items-center justify-center overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight + paddingBottom + 20}`} className="w-full max-w-[380px] h-[210px]">
          {/* Y Ticks & Gridlines */}
          {yTicks.map((tick) => {
            const y = (1 - tick / 100) * chartHeight + 10;
            return (
              <g key={tick}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - 10}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-500 font-mono"
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          {/* Baseline */}
          <line
            x1={paddingLeft}
            y1={chartHeight + 10}
            x2={chartWidth - 10}
            y2={chartHeight + 10}
            stroke="#64748B"
            strokeWidth="1.2"
          />

          {/* Bars */}
          {pilots.map((item, idx) => {
            const barWidth = 90;
            const gap = (chartWidth - paddingLeft - 20 - pilots.length * barWidth) / (pilots.length + 1);
            const x = paddingLeft + gap + idx * (barWidth + gap);
            const h = (item.progress / 100) * chartHeight;
            const y = chartHeight + 10 - h;

            return (
              <g key={item.name} className="group">
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={h}
                  fill="#2563EB"
                  rx="3"
                  className="transition-all duration-700 group-hover:fill-blue-700 cursor-pointer"
                />
                {/* Percentage label on top of bar */}
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-blue-700"
                >
                  {item.progress}%
                </text>
                {/* Label below axis */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 26}
                  textAnchor="middle"
                  className="text-[11px] font-semibold fill-slate-700"
                >
                  {item.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="text-[11px] text-slate-500 text-center mt-1">
        Milestone completion velocity across active departmental sandbox environments
      </p>
    </div>
  );
}
