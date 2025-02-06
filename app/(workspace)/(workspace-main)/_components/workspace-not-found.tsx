'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Box } from 'lucide-react';
import { useRouter } from 'next/navigation';

const WorkspaceNotFound = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800">
          Workspace Not Found
        </h1>
        <p className="mt-2 text-gray-600">
          The workspace you are looking for does not exist or you do not have
          access.
        </p>

        <div className="mt-6 flex gap-4 justify-end">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            onClick={() => router.push('/workspaces')}
            className="bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:opacity-80
              transition"
          >
            <Box className="h-4 w-4" />
            Go My Workspace
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceNotFound;
