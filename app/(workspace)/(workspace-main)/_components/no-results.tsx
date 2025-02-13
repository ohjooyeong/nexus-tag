import { CopyX } from 'lucide-react';

const NoResults = () => (
  <div className="mx-auto py-8">
    <CopyX className="w-36 h-36 text-muted-foreground" />
    <span className="flex items-center justify-center mt-6 text-muted-foreground">
      No Results
    </span>
  </div>
);

export default NoResults;
