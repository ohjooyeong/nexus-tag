'use client';

import { DataItem } from '@/app/(workspace)/(workspace-main)/_types';
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
          <CheckSquareIcon className="w-3 h-3 absolute top-2 left-2 hover:text-blue-500" />
        )}
        {isHover && !isSelected && (
          <SquareIcon className="w-3 h-3 absolute top-2 left-2 hover:text-blue-500" />
        )}
        {isHover && (
          <ExternalLink
            onClick={handleRoute}
            className="w-3 h-3 absolute top-2 right-2 cursor-pointer hover:text-blue-500"
          />
        )}
        <Image
          alt=""
          src={'/assets/placeholder-image.png'}
          width={120}
          height={80}
          className="object-cover h-full cursor-pointer border rounded-md"
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
