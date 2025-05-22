import { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';
import ChartWrapper from './ChartWrapper';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export interface LineChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  borderWidth?: number;
  pointRadius?: number;
  pointHoverRadius?: number;
  tension?: number; // For curved lines (0 = straight, 1 = very curved)
  fill?: boolean;
}

export interface LineChartProps {
  title: string;
  subtitle?: string;
  labels: string[];
  datasets: LineChartDataset[];
  height?: number;
  width?: number;
  className?: string;
  options?: ChartOptions<'line'>;
  isLoading?: boolean;
  downloadCSV?: () => void;
  onRefresh?: () => void;
}

// Default colors for datasets if not provided
const DEFAULT_COLORS = [
  { borderColor: 'rgb(53, 162, 235)', backgroundColor: 'rgba(53, 162, 235, 0.5)' },
  { borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)' },
  { borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.5)' },
  { borderColor: 'rgb(255, 205, 86)', backgroundColor: 'rgba(255, 205, 86, 0.5)' },
  { borderColor: 'rgb(153, 102, 255)', backgroundColor: 'rgba(153, 102, 255, 0.5)' },
  { borderColor: 'rgb(255, 159, 64)', backgroundColor: 'rgba(255, 159, 64, 0.5)' },
];

export default function LineChart({
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
  onRefresh
}: LineChartProps) {
  // Process datasets to apply default colors if not provided
  const processedDatasets = useMemo(() => {
    return datasets.map((dataset, index) => {
      const colorIndex = index % DEFAULT_COLORS.length;
      return {
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.3,
        ...DEFAULT_COLORS[colorIndex],
        ...dataset,
      };
    });
  }, [datasets]);
  
  // Default chart options
  const defaultOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
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
          pointStyle: 'circle',
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
      <Line options={chartOptions} data={data} />
    </ChartWrapper>
  );
}
