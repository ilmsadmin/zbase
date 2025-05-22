import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string; 
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple' | 'yellow';
}

export default function DashboardCard({ 
  title, 
  value, 
  description, 
  trend, 
  icon, 
  color 
}: DashboardCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          iconBg: 'bg-blue-100',
          iconText: 'text-blue-700',
          lightText: 'text-blue-500'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          text: 'text-green-600',
          iconBg: 'bg-green-100',
          iconText: 'text-green-700',
          lightText: 'text-green-500'
        };
      case 'red':
        return {
          bg: 'bg-red-50',
          text: 'text-red-600',
          iconBg: 'bg-red-100',
          iconText: 'text-red-700',
          lightText: 'text-red-500'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-600',
          iconBg: 'bg-purple-100',
          iconText: 'text-purple-700',
          lightText: 'text-purple-500'
        };
      case 'yellow':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-600',
          iconBg: 'bg-amber-100',
          iconText: 'text-amber-700',
          lightText: 'text-amber-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-600',
          iconBg: 'bg-gray-100',
          iconText: 'text-gray-700',
          lightText: 'text-gray-500'
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className={`rounded-lg shadow-sm p-5 ${colorClasses.bg} border border-gray-100`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-800">{value}</p>
          {description && (
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          )}
          
          {trend && (
            <div className="mt-1 flex items-center">
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="ml-1.5 text-xs text-gray-500">so với tháng trước</span>
            </div>
          )}
        </div>

        <div className={`rounded-lg p-2 ${colorClasses.iconBg}`}>
          <div className={`h-8 w-8 ${colorClasses.iconText}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
