import React from 'react';
import ProjectLayoutClient from '../../../../_components/project-layout-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Annotation',
  description: 'Image Annotation',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <ProjectLayoutClient>{children}</ProjectLayoutClient>;
};

export default Layout;
