
import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';

const LoadingState: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-700"></div>
        <span className="ml-3 text-violet-700">Chargement du livrable...</span>
      </div>
    </DashboardLayout>
  );
};

export default LoadingState;
