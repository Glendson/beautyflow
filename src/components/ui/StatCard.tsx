"use client";

import { Card } from "./Card";
import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    direction: "up" | "down";
    value: number;
  };
  color?: "blue" | "emerald" | "amber" | "red";
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  color = "blue",
}: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <Card padding="md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-2">{label}</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            {trend && (
              <span
                className={`text-sm font-semibold ${
                  trend.direction === "up" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {trend.direction === "up" ? "↑" : "↓"} {trend.value}%
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
