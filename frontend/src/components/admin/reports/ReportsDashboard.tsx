import ReportCategory from './ReportCategory';
import QuickStats from './QuickStats';
import SavedReportsList from './SavedReportsList';
import { Card } from '@/components/ui';
import Link from 'next/link';

export default function ReportsDashboard() {
  return (
    <div className="space-y-6">
      <QuickStats />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Report Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ReportCategory 
              name="Revenue Reports" 
              description="Analyze revenue trends and sales performance"
              icon="/icons/chart-bar.svg"
              href="/admin/reports/revenue"
            />
            <ReportCategory 
              name="Inventory Reports" 
              description="Track stock values, movements, and alerts"
              icon="/icons/boxes.svg"
              href="/admin/reports/inventory"
            />
            <ReportCategory 
              name="Customer Reports" 
              description="Analyze customer behavior and purchasing patterns"
              icon="/icons/users.svg"
              href="/admin/reports/customers"
            />
            <ReportCategory 
              name="Custom Report Builder" 
              description="Create and customize your own reports"
              icon="/icons/wrench.svg"
              href="/admin/reports/builder"
            />
          </div>
        </div>
        
        <div>
          <Card className="h-full">
            <h2 className="text-xl font-semibold mb-4">Saved Reports</h2>
            <SavedReportsList />
            <div className="mt-4">
              <Link 
                href="/admin/reports/builder" 
                className="text-primary hover:underline text-sm font-medium"
              >
                Create new report →
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
