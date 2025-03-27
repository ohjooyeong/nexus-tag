'use client';

import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useProfile from '../_hooks/use-profile';

export default function AccountsLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isGoogleProvider } = useProfile();

  return (
    <div className="container max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h3 className="font-medium">Account Settings</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/workspaces')}
        >
          <Briefcase className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-6 p-10 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set your preferences.
          </p>
        </div>
        <Separator />
        <Tabs
          defaultValue={pathname.includes('password') ? 'password' : 'profile'}
          className="space-y-4"
          onValueChange={(value) => {
            router.push(`/accounts/${value}`);
          }}
        >
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            {!isGoogleProvider && (
              <TabsTrigger value="password">Password</TabsTrigger>
            )}
          </TabsList>
        </Tabs>
        {children}
      </div>
    </div>
  );
}
