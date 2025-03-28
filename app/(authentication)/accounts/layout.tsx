import { Metadata } from 'next';
import AccountsLayoutContent from './_components/accounts-layout';

export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Manage your account settings and preferences',
};

export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AccountsLayoutContent>{children}</AccountsLayoutContent>;
}
