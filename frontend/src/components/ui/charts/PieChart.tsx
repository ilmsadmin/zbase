import { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, ChartData } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartWrapper from './ChartWrapper';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

export interface PieChartProps {
  title: string;
  subtitle?: string;
  labels: string[];
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
  borderWidth?: number;
  height?: number;
  width?: number;
  className?: string;
  options?: ChartOptions<'pie'>;
  isLoading?: boolean;
  downloadCSV?: () => void;
  onRefresh?: () => void;
  cutout?: number | string; // For donut chart (e.g., '50%')
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
}

// Default colors for pie segments
const DEFAULT_COLORS = [
  'rgba(53, 162, 235, 0.8)',
  'rgba(255, 99, 132, 0.8)',
  'rgba(75, 192, 192, 0.8)',
  'rgba(255, 205, 86, 0.8)',
  'rgba(153, 102, 255, 0.8)',
  'rgba(255, 159, 64, 0.8)',
  'rgba(54, 162, 235, 0.8)',
  'rgba(255, 99, 132, 0.8)',
  'rgba(75, 192, 192, 0.8)',
  'rgba(255, 205, 86, 0.8)',
];

// Default border colors
const DEFAULT_BORDER_COLORS = [
  'rgb(53, 162, 235)',
  'rgb(255, 99, 132)',
  'rgb(75, 192, 192)',
  'rgb(255, 205, 86)',
  'rgb(153, 102, 255)',
  'rgb(255, 159, 64)',
  'rgb(54, 162, 235)',
  'rgb(255, 99, 132)',
  'rgb(75, 192, 192)',
  'rgb(255, 205, 86)',
];

export default function PieChart({
  title,
  subtitle,
  labels,
  data,
  backgroundColor,
  borderColor,
  borderWidth = 1,
  height = 300,
  width,
  className,
  options,
  isLoading = false,
  downloadCSV,
  onRefresh,
  cutout,
  legendPosition = 'top',
}: PieChartProps) {
  // Generate colors array based on the number of data points
  const colors = useMemo(() => {
    if (backgroundColor) return backgroundColor;
    return data.map((_, index) => DEFAULT_COLORS[index % DEFAULT_COLORS.length]);
  }, [data, backgroundColor]);
  
  // Generate border colors array
  const borders = useMemo(() => {
    if (borderColor) return borderColor;
    return data.map((_, index) => DEFAULT_BORDER_COLORS[index % DEFAULT_BORDER_COLORS.length]);
  }, [data, borderColor]);
  
  // Default chart options
  const defaultOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: legendPosition,
        align: 'start',
        labels: {
          font: {
            size: 12,
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)', // bg-gray-900 with opacity
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 12,
        },
        padding: 10,
        cornerRadius: 4,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const total = context.chart.data.datasets[0].data.reduce((sum: number, val: number) => sum + val, 0);
            const value = context.raw as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout,
  };
  
  // Merge default options with custom options
  const chartOptions = { ...defaultOptions, ...options };
  
  // Chart data
  const chartData: ChartData<'pie'> = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderColor: borders,
        borderWidth,
      },
    ],
  };

  return (
    <ChartWrapper
      title={title}
      subtitle={subtitle}
      height={height}
      width={width}
      className={className}
      isLoading={isLoading}
      downloadCSV={downloadCSV}
      onRefresh={onRefresh}
    >
      <Pie options={chartOptions} data={chartData} />
    </ChartWrapper>
  );
}
