import { PageContainer } from '@/components/ui';
import InventoryReports from '@/components/admin/reports/inventory/InventoryReports';

export const metadata = {
  title: 'Inventory Reports | ZBase Admin',
  description: 'Analyze inventory data and stock levels for your business.'
};

export default function InventoryReportsPage() {
  return (
    <PageContainer title="Inventory Reports" subtitle="Analyze inventory data and stock levels">
      <InventoryReports />
    </PageContainer>
  );
}
