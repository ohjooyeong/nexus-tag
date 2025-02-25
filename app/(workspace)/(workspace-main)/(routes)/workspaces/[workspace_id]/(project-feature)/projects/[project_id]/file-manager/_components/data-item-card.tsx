'use client';

import { DataItem } from '@/app/(workspace)/(workspace-main)/_types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { CheckSquareIcon, Edit2, ExternalLink, SquareIcon } from 'lucide-react';
import Image from 'next/image';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

interface DataItemCardProps {
  dataItem: DataItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const DataItemCard = ({
  dataItem,
  isSelected,
  onSelect,
}: DataItemCardProps) => {
  const router = useRouter();
  const { workspace_id: workspaceId, project_id: projectId } = useParams();

  const [isHover, setIsHover] = useState(false);

  const handleRoute = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    event.stopPropagation();

    router.push(
      `/workspaces/${workspaceId}/projects/${projectId}/image-annotate/${dataItem.id}`,
    );
  };

  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${dataItem.fileUrl}`;

  return (
    <div
      className="flex relative flex-col"
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
    >
      <div className="relative" onClick={() => onSelect(dataItem.id)}>
        {isSelected && (
          <CheckSquareIcon className="w-3 h-3 absolute top-2 left-2 hover:text-blue-500 text-blue-600" />
        )}
        {isHover && !isSelected && (
          <SquareIcon className="w-3 h-3 absolute top-2 left-2 hover:text-blue-500 text-blue-600" />
        )}
        {isHover && (
          <ExternalLink
            onClick={handleRoute}
            className="w-3 h-3 absolute top-2 right-2 cursor-pointer hover:text-blue-500 text-blue-600"
          />
        )}
        <Image
          alt=""
          src={dataItem?.fileUrl ? imageUrl : '/assets/placeholder-image.png'}
          width={120}
          height={80}
          className="object-fill h-full cursor-pointer border rounded-md max-h-20 min-h-20"
        />
      </div>
      <div className="flex items-center pt-1">
        <p
          className={cn(
            'truncate max-w-[120px] text-xs',
            isHover && 'max-w-[100px]',
          )}
        >
          {dataItem?.name}
        </p>
        {isHover && <Edit2 className="flex w-3 h-3 ml-1" />}
      </div>
    </div>
  );
};

export default DataItemCard;

DataItemCard.Skeleton = function DataItemCardSkeleton() {
  return (
    <div className="flex relative flex-col">
      <Skeleton className="h-[80px] w-[120px]" />

      <div className="flex items-center pt-1">
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
};
