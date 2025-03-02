import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ClassesList from './classes-list';

const ClassesPanel = () => {
  return (
    <div className="border border-b-0 overflow-auto px-4 pb-4 h-full">
      <div className="flex flex-col max-h-0">
        <div className="mb-3">
          <section className="flex flex-col mt-3 gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Filter label classes" className="pl-8" />
            </div>
            <div>
              <ClassesList />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ClassesPanel;
