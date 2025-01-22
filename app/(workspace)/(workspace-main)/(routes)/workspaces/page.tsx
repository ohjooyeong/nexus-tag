'use client';

import { Spinner } from '@/components/spinner';

const WorkspacesPage = () => {
  return (
    <div className="h-screen">
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size={'icon'} />
      </div>
    </div>
  );
};

export default WorkspacesPage;
