import { Metadata } from 'next';

import WorkspaceLayoutClient from '../../../_components/workspace-layout-client';

export const metadata: Metadata = {
  title: 'Nexus Tag | Workspace',
  description: 'Workspace management and configuration.',
};

const WorkspaceLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <WorkspaceLayoutClient>{children}</WorkspaceLayoutClient>;
};

export default WorkspaceLayout;
