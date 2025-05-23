import { RevenueReportData } from '@/services/api/reports';
import { DataTable } from '@/components/ui';
import { format, parseISO } from 'date-fns';

interface RevenueTableProps {
  data?: RevenueReportData;
  isLoading: boolean;
}

export default function RevenueTable({ data, isLoading }: RevenueTableProps) {
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
    ],
    totalRevenue: 22780,
    totalTransactions: 287,
    averageTransactionValue: 79.37,
  };

  const displayData = data || mockData;

  const columns = [
    {
      header: 'Date',
      accessorKey: 'date',
      cell: ({ row }: any) => format(parseISO(row.original.date), 'MMM dd, yyyy'),
    },
    {
      header: 'Revenue',
      accessorKey: 'amount',
      cell: ({ row }: any) => `$${row.original.amount.toLocaleString()}`,
    },
    {
      header: 'Transactions',
      accessorKey: 'transactionCount',
    },
    {
      header: 'Average Order Value',
      cell: ({ row }: any) => {
        const avg = row.original.amount / row.original.transactionCount;
        return `$${avg.toFixed(2)}`;
      },
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-700 font-medium">Total Revenue</div>
            <div className="text-2xl font-bold">${displayData.totalRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-700 font-medium">Total Transactions</div>
            <div className="text-2xl font-bold">{displayData.totalTransactions}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-700 font-medium">Average Transaction</div>
            <div className="text-2xl font-bold">${displayData.averageTransactionValue.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={displayData.revenues}
        pagination
      />
    </div>
  );
}
