import { PageContainer } from '@/components/ui';
import CustomerReports from '@/components/admin/reports/customers/CustomerReports';

export const metadata = {
  title: 'Customer Reports | ZBase Admin',
  description: 'Analyze customer data and purchasing behavior.'
};

export default function CustomerReportsPage() {
  return (
    <PageContainer title="Customer Reports" subtitle="Analyze customer data and purchasing behavior">
      <CustomerReports />
    </PageContainer>
  );
}
