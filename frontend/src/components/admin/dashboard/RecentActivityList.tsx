import Link from 'next/link';
import { 
  ClockIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  CubeIcon,
  TruckIcon,
  BanknotesIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationCircleIcon, ClockIcon as ClockSolidIcon } from '@heroicons/react/24/solid';

type ActivityType = 'invoice' | 'customer' | 'product' | 'inventory' | 'transaction' | 'warranty';
type ActivityStatus = 'completed' | 'pending' | 'error';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  time: string;
  status: ActivityStatus;
  link: string;
}

interface RecentActivityListProps {
  activities: Activity[];
  maxItems?: number;
  showViewAll?: boolean;
}

export default function RecentActivityList({ 
  activities, 
  maxItems = 5,
  showViewAll = true 
}: RecentActivityListProps) {
  const displayActivities = activities.slice(0, maxItems);
  
  const getIconForType = (type: ActivityType) => {
    switch (type) {
      case 'invoice':
        return <DocumentTextIcon className="h-6 w-6" />;
      case 'customer':
        return <UserGroupIcon className="h-6 w-6" />;
      case 'product':
        return <CubeIcon className="h-6 w-6" />;
      case 'inventory':
        return <TruckIcon className="h-6 w-6" />;
      case 'transaction':
        return <BanknotesIcon className="h-6 w-6" />;
      case 'warranty':
        return <ShieldCheckIcon className="h-6 w-6" />;
      default:
        return <DocumentTextIcon className="h-6 w-6" />;
    }
  };

  const getStatusIcon = (status: ActivityStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockSolidIcon className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockSolidIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">Hoạt động gần đây</h3>
          </div>
          {showViewAll && (
            <Link
              href="/admin/activities"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Xem tất cả
            </Link>
          )}
        </div>
      </div>
      <ul className="divide-y divide-gray-200">
        {displayActivities.length > 0 ? (
          displayActivities.map((activity) => (
            <li key={activity.id}>
              <Link 
                href={activity.link}
                className="px-4 py-4 sm:px-6 block hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      {getIconForType(activity.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium text-gray-800 truncate">{activity.title}</p>
                      <div className="ml-2 flex-shrink-0">
                        {getStatusIcon(activity.status)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                    <p className="mt-1 text-xs text-gray-400 flex items-center">
                      <ClockIcon className="h-3 w-3 mr-1" /> {activity.time}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <li className="px-4 py-5 text-center text-sm text-gray-500">
            Không có hoạt động nào gần đây
          </li>
        )}
      </ul>
    </div>
  );
}
