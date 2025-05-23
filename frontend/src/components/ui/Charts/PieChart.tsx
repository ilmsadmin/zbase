import React from 'react';
import {
  PieChart as ReChartPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  colors?: string[];
}

const defaultColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function PieChart({ data, colors = defaultColors }: PieChartProps) {
  // Make sure we don't exceed available colors
  const chartColors = colors.length >= data.length 
    ? colors 
    : [...colors, ...defaultColors.slice(0, data.length - colors.length)];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReChartPie>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
        <Legend />
      </ReChartPie>
    </ResponsiveContainer>
  );
}
