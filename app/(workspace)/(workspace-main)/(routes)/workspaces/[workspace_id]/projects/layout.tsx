import CommonWorkspaceLayout from '@/app/(workspace)/(workspace-main)/_components/common-workspace-layout';

function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspace_id: string };
}) {
  return (
    <CommonWorkspaceLayout params={params}>{children}</CommonWorkspaceLayout>
  );
}

export default Layout;
