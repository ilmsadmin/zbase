import { PageContainer } from '@/components/ui';
import RevenueReports from '@/components/admin/reports/revenue/RevenueReports';

export const metadata = {
  title: 'Revenue Reports | ZBase Admin',
  description: 'Analyze revenue data and trends for your business.'
};

export default function RevenueReportsPage() {  return (
    <PageContainer maxWidth="full" title="Revenue Reports" subtitle="Analyze revenue data and trends">
      <RevenueReports />
    </PageContainer>
  );
}
