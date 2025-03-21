import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const OauthLoginButtonSection = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <Button variant="outline" type="button" disabled={isLoading} asChild>
      <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback`}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{' '}
        Google
      </Link>
    </Button>
  );
};

export default OauthLoginButtonSection;
