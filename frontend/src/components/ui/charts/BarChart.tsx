import { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartWrapper from './ChartWrapper';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export interface BarChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  borderRadius?: number;
  hoverBackgroundColor?: string | string[];
}

export interface BarChartProps {
  title: string;
  subtitle?: string;
  labels: string[];
  datasets: BarChartDataset[];
  height?: number;
  width?: number;
  className?: string;
  options?: ChartOptions<'bar'>;
  isLoading?: boolean;
  downloadCSV?: () => void;
  onRefresh?: () => void;
  horizontal?: boolean;
}

// Default colors for datasets if not provided
const DEFAULT_COLORS = [
  { backgroundColor: 'rgba(53, 162, 235, 0.8)', borderColor: 'rgb(53, 162, 235)' },
  { backgroundColor: 'rgba(255, 99, 132, 0.8)', borderColor: 'rgb(255, 99, 132)' },
  { backgroundColor: 'rgba(75, 192, 192, 0.8)', borderColor: 'rgb(75, 192, 192)' },
  { backgroundColor: 'rgba(255, 205, 86, 0.8)', borderColor: 'rgb(255, 205, 86)' },
  { backgroundColor: 'rgba(153, 102, 255, 0.8)', borderColor: 'rgb(153, 102, 255)' },
  { backgroundColor: 'rgba(255, 159, 64, 0.8)', borderColor: 'rgb(255, 159, 64)' },
];

export default function BarChart({
  title,
  subtitle,
  labels,
  datasets,
  height = 300,
  width,
  className,
  options,
  isLoading = false,
  downloadCSV,
  onRefresh,
  horizontal = false,
}: BarChartProps) {
  // Process datasets to apply default colors if not provided
  const processedDatasets = useMemo(() => {
    return datasets.map((dataset, index) => {
      const colorIndex = index % DEFAULT_COLORS.length;
      return {
        borderWidth: 1,
        borderRadius: 4,
        ...DEFAULT_COLORS[colorIndex],
        ...dataset,
      };
    });
  }, [datasets]);
  
  // Default chart options
  const defaultOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x', // For horizontal bar chart
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12,
          },
          color: '#64748b', // text-slate-500
        },
        grid: {
          color: '#e2e8f0', // border-slate-200
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
          color: '#64748b', // text-slate-500
          maxRotation: horizontal ? 0 : 45,
          minRotation: horizontal ? 0 : 45,
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'rectRounded',
          font: {
            size: 12,
          },
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
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    // For stacked bar chart (uncomment if needed)
    // scales: {
    //   x: { stacked: true },
    //   y: { stacked: true }
    // }
  };
  
  // Merge default options with custom options
  const chartOptions = { ...defaultOptions, ...options };
  
  // Chart data
  const data = {
    labels,
    datasets: processedDatasets,
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
      <Bar options={chartOptions} data={data} />
    </ChartWrapper>
  );
}
