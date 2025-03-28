import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'File Manager',
  description: 'File Manager',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
