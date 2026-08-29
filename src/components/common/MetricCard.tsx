import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    isPositive?: boolean;
  };
  accentColor?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = '#B88A52',
  onClick,
}) => {
  return (
    <motion.div
      id={id}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`relative p-5 rounded-2xl glass-frame glass-frame-hover ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5A3825]/90 font-mono">
            {title}
          </span>
          <div className="text-3xl font-extrabold text-[#24150F] font-display tracking-tight mt-1">
            {value}
          </div>
        </div>
        <div
          className="p-3 rounded-xl flex items-center justify-center shadow-xs border border-white/60"
          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#DCC7AE]/50 flex items-center justify-between text-xs">
        {subtitle && <span className="text-[#5A3825]/90 font-medium">{subtitle}</span>}
        {trend && (
          <div
            className={`flex items-center gap-1 font-semibold ${
              trend.isPositive === false
                ? 'text-red-700'
                : trend.isPositive === true
                ? 'text-emerald-700'
                : 'text-[#5A3825]'
            }`}
          >
            {trend.direction === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
            {trend.direction === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
            {trend.direction === 'neutral' && <Minus className="w-3.5 h-3.5" />}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
