import { PageContainer } from '@/components/ui';
import ReportBuilder from '@/components/admin/reports/builder/ReportBuilder';

export const metadata = {
  title: 'Custom Report Builder | ZBase Admin',
  description: 'Create and customize your own reports and visualizations.'
};

export default function ReportBuilderPage() {
  return (
    <PageContainer title="Custom Report Builder" subtitle="Create and customize your own reports">
      <ReportBuilder />
    </PageContainer>
  );
}
