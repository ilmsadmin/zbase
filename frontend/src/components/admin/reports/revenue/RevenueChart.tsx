import { BarChart } from '@/components/ui/Charts';
import { RevenueReportData } from '@/services/api/reports';
import { format, parseISO } from 'date-fns';

interface RevenueChartProps {
  data?: RevenueReportData;
  isLoading: boolean;
  groupBy: 'day' | 'week' | 'month';
}

export default function RevenueChart({ data, isLoading, groupBy }: RevenueChartProps) {
  if (isLoading) {
    return <div className="animate-pulse h-80 bg-gray-100 rounded-md"></div>;
  }

  // If no data from API, show mock data
  const mockData: RevenueReportData = {
    revenues: [
      { date: '2025-04-24', amount: 1240, transactionCount: 15 },
      { date: '2025-04-25', amount: 1350, transactionCount: 18 },
      { date: '2025-04-26', amount: 1100, transactionCount: 14 },
      { date: '2025-04-27', amount: 900, transactionCount: 12 },
      { date: '2025-04-28', amount: 1500, transactionCount: 20 },
      { date: '2025-04-29', amount: 1700, transactionCount: 22 },
      { date: '2025-04-30', amount: 1300, transactionCount: 17 },
      { date: '2025-05-01', amount: 1600, transactionCount: 21 },
      { date: '2025-05-02', amount: 1450, transactionCount: 19 },
      { date: '2025-05-03', amount: 1250, transactionCount: 16 },
      { date: '2025-05-04', amount: 980, transactionCount: 13 },
      { date: '2025-05-05', amount: 1100, transactionCount: 14 },
      { date: '2025-05-06', amount: 1340, transactionCount: 17 },
      { date: '2025-05-07', amount: 1680, transactionCount: 22 },
      { date: '2025-05-08', amount: 1560, transactionCount: 20 },
      { date: '2025-05-09', amount: 1240, transactionCount: 16 },
      { date: '2025-05-10', amount: 890, transactionCount: 11 },
      { date: '2025-05-11', amount: 1020, transactionCount: 13 },
      { date: '2025-05-12', amount: 1450, transactionCount: 19 },
      { date: '2025-05-13', amount: 1700, transactionCount: 23 },
      { date: '2025-05-14', amount: 1820, transactionCount: 24 },
      { date: '2025-05-15', amount: 1550, transactionCount: 20 },
      { date: '2025-05-16', amount: 1380, transactionCount: 18 },
      { date: '2025-05-17', amount: 1050, transactionCount: 14 },
      { date: '2025-05-18', amount: 980, transactionCount: 12 },
      { date: '2025-05-19', amount: 1430, transactionCount: 19 },
      { date: '2025-05-20', amount: 1580, transactionCount: 21 },
      { date: '2025-05-21', amount: 1690, transactionCount: 22 },
      { date: '2025-05-22', amount: 1520, transactionCount: 20 },
      { date: '2025-05-23', amount: 1420, transactionCount: 18 },
    ],
    totalRevenue: 42520,
    totalTransactions: 552,
    averageTransactionValue: 77.03,
  };

  const displayData = data || mockData;

  // Format dates based on groupBy
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    switch (groupBy) {
      case 'day':
        return format(date, 'MMM dd');
      case 'week':
        return `Week ${format(date, 'w')}`;
      case 'month':
        return format(date, 'MMM yyyy');
      default:
        return format(date, 'MMM dd');
    }
  };

  const chartData = {
    labels: displayData.revenues.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: 'Revenue',
        data: displayData.revenues.map((item) => item.amount),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue ($)',
        },
      },
      x: {
        title: {
          display: true,
          text: groupBy === 'day' ? 'Day' : groupBy === 'week' ? 'Week' : 'Month',
        },
      },
    },
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between mb-6">
        <div className="bg-blue-50 rounded-lg p-4 mb-4 md:mb-0 w-full md:w-auto">
          <div className="text-sm text-blue-700 font-medium">Total Revenue</div>
          <div className="text-2xl font-bold">${displayData.totalRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 mb-4 md:mb-0 w-full md:w-auto">
          <div className="text-sm text-green-700 font-medium">Total Transactions</div>
          <div className="text-2xl font-bold">{displayData.totalTransactions}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 w-full md:w-auto">
          <div className="text-sm text-purple-700 font-medium">Average Transaction</div>
          <div className="text-2xl font-bold">${displayData.averageTransactionValue.toFixed(2)}</div>
        </div>
      </div>

      <div className="h-80">
        <BarChart data={chartData} options={options} />
      </div>
    </div>
  );
}
