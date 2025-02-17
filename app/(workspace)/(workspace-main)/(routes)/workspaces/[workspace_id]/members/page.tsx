'use client';

import { UserTable } from './_components/user-table';
import { columns, mobileColumns } from './_components/columns';
import { useIsMobile } from '@/hooks/use-mobile';

const MembersPage = () => {
  const isMobile = useIsMobile();
  const datas = require('/public/tasks.json');

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between min-h-9 gap-2">
          <h1 className="text-2xl font-bold">Members</h1>
        </div>
        <div className="md:max-w-3xl">
          <UserTable
            data={datas}
            columns={isMobile ? mobileColumns : columns}
          />
        </div>
      </div>
    </div>
  );
};

export default MembersPage;
