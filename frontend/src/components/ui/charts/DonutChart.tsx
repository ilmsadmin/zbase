import PieChart, { PieChartProps } from './PieChart';

// DonutChart is just a PieChart with a cutout in the middle
export default function DonutChart(props: Omit<PieChartProps, 'cutout'>) {
  return <PieChart {...props} cutout="50%" />;
}
