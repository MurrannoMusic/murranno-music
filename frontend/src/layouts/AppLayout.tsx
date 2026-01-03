import { Outlet } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';

export const AppLayout = () => {
  return (
    <PageContainer>
      <Outlet />
    </PageContainer>
  );
};
