'use client';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import DatasetCard from './dataset-card';

import NewDatasetDialog from './dialog/new-dataset-dialog';
import useDatasetList from '../_hooks/use-dataset-list';
import { Dataset } from '@/app/(workspace)/(workspace-main)/_types';
import DatasetCardAll from './dataset-card-all';
import useDatasetStats from '../_hooks/use-dataset-stats';
import DataItemList from './data-item-list';

const FileManager = () => {
  const [query, setQuery] = useState('');

  const [showNewDatasetDialog, setShowNewDatasetDialog] = useState(false);

  const { data } = useDatasetList();
  const { data: datsetStats } = useDatasetStats();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const handleReset = () => {
    setQuery('');
  };

  return (
    <div className="border rounded-md overflow-auto p-4">
      <div className="flex flex-row">
        <div className="w-[360px] shrink-0">
          <div className="flex flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Datasets</h2>

            <Button
              className="p-1 text-xs px-4 h-8"
              onClick={() => setShowNewDatasetDialog(true)}
            >
              <Plus />
              Create New
            </Button>
          </div>
          <div className="flex flex-row items-center mb-4">
            <div className="flex-1 relative">
              <Search className="opacity-50 absolute left-2 top-2" />
              <Input
                placeholder="Search Datasets"
                className="pl-10 h-10 bg-transparent outline-none placeholder:text-muted-foreground
                  disabled:opacity-50 text-sm hover:bg-accent hover:text-accent-foreground"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                onChange={handleChange}
                value={query}
              />
            </div>
          </div>
          <ul className="list-none m-0 p-0 relative bg-none max-h-[calc(100vh-473px)] overflow-auto">
            <DatasetCardAll
              totalDatasets={datsetStats?.totalDatasets ?? 0}
              totalItems={datsetStats?.totalItems ?? 0}
            />
            {data &&
              data.map((dataset: Dataset) => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))}
          </ul>
        </div>
        <DataItemList />
      </div>
      <NewDatasetDialog
        isOpen={showNewDatasetDialog}
        onClose={() => setShowNewDatasetDialog(false)}
      />
    </div>
  );
};

export default FileManager;
