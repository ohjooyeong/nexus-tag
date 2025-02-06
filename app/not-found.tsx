'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-md rounded-lg bg-white p-8 shadow-lg text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        <h1 className="mt-4 text-2xl font-bold text-gray-800">
          Page Not Found
        </h1>
        <p className="mt-2 text-gray-600">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            onClick={() => router.push('/')}
            className="bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:opacity-80
              transition"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
