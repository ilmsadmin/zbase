import { Card } from '@/components/ui';
import { QuickStat } from '@/services/api/reports';
import { useQuery } from '@tanstack/react-query';
import { getQuickStats } from '@/services/api/reports';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

export default function QuickStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['reportQuickStats'],
    queryFn: getQuickStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </Card>
        ))}
      </div>
    );
  }

  const mockStats: QuickStat[] = [
    {
      id: '1',
      label: 'Total Revenue',
      value: '$12,345.67',
      change: 12.5,
      changeLabel: 'vs last month',
      direction: 'up',
    },
    {
      id: '2',
      label: 'Total Orders',
      value: '127',
      change: 5.2,
      changeLabel: 'vs last month',
      direction: 'up',
    },
    {
      id: '3',
      label: 'Average Order Value',
      value: '$97.21',
      change: 2.1,
      changeLabel: 'vs last month',
      direction: 'up',
    },
    {
      id: '4',
      label: 'Products at Low Stock',
      value: '8',
      change: -3,
      changeLabel: 'since last week',
      direction: 'down',
    },
  ];

  // Use mock data if the API doesn't return data yet
  const displayStats = stats || mockStats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayStats.map((stat) => (
        <Card key={stat.id} className="p-4">
          <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
          <div className="text-2xl font-bold mt-1">{stat.value}</div>
          <div className="flex items-center mt-1">
            {stat.direction === 'up' ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
            ) : stat.direction === 'down' ? (
              <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
            ) : null}
            <span
              className={`text-xs font-medium ${
                stat.direction === 'up'
                  ? 'text-green-500'
                  : stat.direction === 'down'
                  ? 'text-red-500'
                  : 'text-gray-500'
              }`}
            >
              {stat.change > 0 ? '+' : ''}
              {stat.change}% {stat.changeLabel}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
