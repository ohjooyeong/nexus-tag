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
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useDatasetItem from '../_hooks/use-dataset-item';
import useDatasetAllItem from '../_hooks/use-dataset-all-item';
import { DataItem } from '@/app/(workspace)/(workspace-main)/_types';
import NoResultDataItem from './no-result-data-item';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import DeleteDataItemDialog from './dialog/delete-data-item.dialog';

const DataItemList = () => {
  const searchParams = useSearchParams();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [showDeleteItems, setShowDeleteItems] = useState<boolean>(false);

  const datasetId = searchParams.get('datasetId');

  const { data: singleDatasetItems, isLoading: isSingleLoading } =
    useDatasetItem(datasetId || '', page, limit, 'asc');
  const { data: allDatasetItems, isLoading: isAllLoading } = useDatasetAllItem(
    page,
    limit,
    'asc',
  );

  const items = datasetId
    ? (singleDatasetItems?.items as DataItem[]) || []
    : (allDatasetItems?.items as DataItem[]) || [];

  const isLoading = datasetId ? isSingleLoading : isAllLoading;

  const totalPages =
    Math.ceil(
      (datasetId ? singleDatasetItems?.total : allDatasetItems?.total) / limit,
    ) || 1;

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

  const handleDeleteItems = () => {
    if (selectedItems.length > 0) {
      setShowDeleteItems(true);
    }
  };

  const handlePageSizeChange = (value: string) => {
    setLimit(Number(value));
    setPage(1);
    setSelectedItems([]);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSelectedItems([]);
  };

  const handleResetSelectedItems = () => {
    setSelectedItems([]);
  };

  // datasetId가 바뀔 때 선택된 아이템 초기화
  useEffect(() => {
    setSelectedItems([]);
  }, [datasetId]);

  return (
    <div className="flex-1 ml-8">
      <div className="flex items-center sticky mb-2 px-2 z-50">
        <div className="flex items-center justify-center h-8 w-8">
          <Checkbox
            className="w-4 h-4"
            checked={
              selectedItems.length !== 0 &&
              selectedItems.length === items.length
            }
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
            onClick={handleDeleteItems}
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
        {!isLoading &&
          (items.length === 0 ? (
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
          ))}
        {isLoading &&
          Array.from({ length: 10 }, (_, index) => (
            <DataItemCard.Skeleton key={index} />
          ))}
      </div>

      <div className="flex items-center justify-center py-4 min-h-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && handlePageChange(page - 1)}
                className={
                  page <= 1
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;

              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= page - 1 && pageNumber <= page + 1)
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={page === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (pageNumber === page - 2 || pageNumber === page + 2) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return null;
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => page < totalPages && handlePageChange(page + 1)}
                className={
                  page >= totalPages
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <DeleteDataItemDialog
        isOpen={showDeleteItems}
        onClose={() => {
          setShowDeleteItems(false);
        }}
        itemIds={selectedItems}
        onReset={handleResetSelectedItems}
      />
    </div>
  );
};

export default DataItemList;
