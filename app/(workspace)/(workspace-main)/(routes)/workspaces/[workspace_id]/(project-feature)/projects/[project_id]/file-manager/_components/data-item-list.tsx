'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrashIcon } from 'lucide-react';
import DataItemCard from './data-item-card';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useDatasetItem from '../_hooks/use-dataset-item';
import useDatasetAllItem from '../_hooks/use-dataset-all-item';
import { DataItem } from '@/app/(workspace)/(workspace-main)/_types';
import NoResultDataItem from './no-result-data-item';

const DataItemList = () => {
  const searchParams = useSearchParams();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const datasetId = searchParams.get('datasetId');

  // Conditionally use the appropriate hook
  const {
    data: singleDatasetItems,
    isLoading: isSingleLoading,
    isError: isSingleError,
  } = useDatasetItem(datasetId || '', page, limit, 'asc');
  const {
    data: allDatasetItems,
    isLoading: isAllLoading,
    isError: isAllError,
  } = useDatasetAllItem(page, limit, 'asc');

  const items = datasetId
    ? (singleDatasetItems?.items as DataItem[]) || []
    : (allDatasetItems?.items as DataItem[]) || [];

  const isLoading = datasetId ? isSingleLoading : isAllLoading;
  const isError = datasetId ? isSingleError : isAllError;

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

  const handlePageSizeChange = (value: string) => {
    setLimit(Number(value));
    setPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="flex-1 ml-8">
      <div className="flex items-center sticky mb-2 px-2 z-50">
        <div className="flex items-center justify-center h-8 w-8">
          <Checkbox
            className="w-4 h-4"
            checked={selectedItems.length === items.length}
            indeterminate={
              selectedItems.length > 0 && selectedItems.length < items.length
            }
            onCheckedChange={handleSelectAll}
          />
        </div>
        <div className="flex items-center justify-center h-8 w-8">
          <TrashIcon
            className={`w-4 h-4 ${
              selectedItems.length > 0
                ? 'cursor-pointer text-red-500'
                : 'text-gray-400'
              }`}
            onClick={() => {
              if (selectedItems.length > 0) {
                console.log('Deleting items:', selectedItems);
              }
            }}
          />
        </div>
        <div className="flex flex-row ml-auto">
          <div className="flex flex-row items-center">
            <p className="text-sm mr-3">Items per page:</p>
            <Select
              value={limit.toString()}
              onValueChange={handlePageSizeChange}
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
        {items.length === 0 ? (
          <NoResultDataItem />
        ) : (
          items.map((item: DataItem) => (
            <DataItemCard
              key={item.id}
              isSelected={selectedItems.includes(item.id)}
              onSelect={handleSelectItem}
              dataItem={item}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DataItemList;
