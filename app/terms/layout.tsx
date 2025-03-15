import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nexus Tag | Terms of Service',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};
export default Layout;
