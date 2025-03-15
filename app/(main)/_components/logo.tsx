import { Cloud } from 'lucide-react';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href={'/'} className="flex items-center">
      <Cloud className="h-10 w-10 mr-3 text-blue-600" />
      <h1
        className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-transparent
          bg-clip-text"
      >
        Nexus Tag
      </h1>
    </Link>
  );
};

export default Logo;
