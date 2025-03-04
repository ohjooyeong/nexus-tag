import { Input } from '@/components/ui/input';
import { Search, XIcon } from 'lucide-react';
import ClassesList from './classes-list';
import useClassLabels from '../../_hooks/use-class-labels';
import { LabelClassType } from '../../_types/label-class';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const ClassesPanel = () => {
  const [query, setQuery] = useState('');

  const { data: objectLabels } = useClassLabels(LabelClassType.OBJECT);
  const { data: semanticLabels } = useClassLabels(LabelClassType.SEMANTIC);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleReset = () => {
    setQuery('');
  };

  const filteredObjectLabels = objectLabels?.filter((label: any) =>
    label.name.toLowerCase().includes(query.toLowerCase()),
  );

  const filteredSemanticLabels = semanticLabels?.filter((label: any) =>
    label.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="border border-b-0 overflow-auto px-4 pb-4 h-full">
      <div className="flex flex-col max-h-0">
        <div className="mb-3">
          <section className="flex flex-col mt-3 gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter label classes"
                className="pl-8 pr-8"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                onChange={handleChange}
                value={query}
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2.5 h-4 w-4 p-0"
                  onClick={handleReset}
                >
                  <XIcon />
                </Button>
              )}
            </div>
            <div>
              <ClassesList
                filteredObjectLabels={filteredObjectLabels}
                filteredSemanticLabels={filteredSemanticLabels}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ClassesPanel;
