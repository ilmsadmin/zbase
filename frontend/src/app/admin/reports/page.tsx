import { PageContainer } from '@/components/ui';
import ReportsDashboard from '@/components/admin/reports/ReportsDashboard';

export const metadata = {
  title: 'Reports Dashboard | ZBase Admin',
  description: 'Access and manage various reports and analytics for your business.'
};

export default function ReportsPage() {  return (
    <PageContainer maxWidth="full" title="Reports & Analytics" subtitle="Access and analyze your business data">
      <ReportsDashboard />
    </PageContainer>
  );
}
