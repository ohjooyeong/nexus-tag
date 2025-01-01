import { Cloud } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center">
      <Cloud className="h-10 w-10 mr-3 text-blue-600" />
      <h1
        className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-transparent
          bg-clip-text"
      >
        Nexus Tag
      </h1>
    </div>
  );
};

export default Logo;
