'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import DataItemCard from './data-item-card';
import DatasetCard from './dataset-card';
import { mockDatasets } from '@/app/(workspace)/(workspace-main)/data/mock-data';

const FileManager = () => {
  const [query, setQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Dummy data for example
  const items = [
    { id: '1', title: 'Item 1' },
    { id: '2', title: 'Item 2' },
    { id: '3', title: 'Item 3' },
    { id: '4', title: 'Item 4' },
    { id: '5', title: 'Item 5' },
    { id: '6', title: 'Item 6' },
    { id: '7', title: 'Item 7' },
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(items.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

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
            <div>
              <Button className="p-1 text-xs px-4 h-8">
                <Plus />
                Create New
              </Button>
            </div>
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
            <DatasetCard isAll />
            {mockDatasets.map((dataset) => (
              <DatasetCard dataset={dataset} />
            ))}
          </ul>
        </div>
        <div className="flex-1 ml-8">
          <div className="flex items-center sticky mb-2 px-2 z-50">
            <div className="flex items-center justify-center h-8 w-8">
              <Checkbox
                className="w-4 h-4"
                checked={
                  selectedItems.length === items.length ||
                  (selectedItems.length > 0 &&
                    selectedItems.length < items.length &&
                    'indeterminate')
                }
                onCheckedChange={handleSelectAll}
              />
            </div>
            <div className="flex items-center justify-center h-8 w-8">
              <TrashIcon
                className={`w-4 h-4
                  ${selectedItems.length > 0 ? 'cursor-pointer text-red-500' : 'text-gray-400'}`}
                onClick={() => {
                  if (selectedItems.length > 0) {
                    // Handle delete action
                    console.log('Deleting items:', selectedItems);
                  }
                }}
              />
            </div>
            <div className="flex flex-row ml-auto">
              <div className="flex flex-row items-center">
                <p className="text-sm mr-3">Items per page:</p>
                <Select
                  defaultValue="100"
                  onValueChange={(value) => {
                    console.log(value);
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[20, 40, 60, 80, 100].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap content-start overflow-x-auto h-[calc(100vh-473px)]">
            {items.map((item) => (
              <DataItemCard
                key={item.id}
                isSelected={selectedItems.includes(item.id)}
                onSelect={handleSelectItem}
                {...item}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManager;
