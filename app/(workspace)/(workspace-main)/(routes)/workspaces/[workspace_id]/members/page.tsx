'use client';

import { UserTable } from './_components/user-table';
import { columns, mobileColumns } from './_components/columns';
import { useIsMobile } from '@/hooks/use-mobile';
import useMemberList from './_hooks/use-member-list';

const MembersPage = () => {
  const isMobile = useIsMobile();

  const { data: memberList } = useMemberList();

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between min-h-9 gap-2">
          <h1 className="text-2xl font-bold">Members</h1>
        </div>
        <div className="md:max-w-3xl">
          <UserTable
            data={memberList}
            columns={isMobile ? mobileColumns : columns}
          />
        </div>
      </div>
    </div>
  );
};

export default MembersPage;
