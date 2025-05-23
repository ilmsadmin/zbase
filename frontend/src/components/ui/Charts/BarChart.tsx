import React from 'react';
import {
  BarChart as ReChartBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BarChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  color?: string;
}

export function BarChart({ data, color = '#0088FE' }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReChartBar
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
        <Legend />
        <Bar dataKey="value" fill={color} name="Amount" />
      </ReChartBar>
    </ResponsiveContainer>
  );
}
