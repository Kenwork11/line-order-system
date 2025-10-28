'use client';

import DashboardPageLayout from '@/components/store/DashboardPageLayout';
import ProductsList from '@/components/store/ProductsList';

export default function ProductsPage() {
  return (
    <DashboardPageLayout title="商品管理">
      <ProductsList />
    </DashboardPageLayout>
  );
}
