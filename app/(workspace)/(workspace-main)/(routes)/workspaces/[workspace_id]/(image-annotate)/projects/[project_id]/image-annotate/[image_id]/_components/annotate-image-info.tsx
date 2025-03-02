'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import useDataItem from '../_hooks/use-data-item';

const AnnotateImageInfo = () => {
  const { data } = useDataItem();

  return (
    <Tooltip>
      <TooltipTrigger>
        <span className="pl-4 text-sm font-normal text-gray-700">
          {data?.name || '-'}
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <div className="flex flex-col gap-4 p-2">
          <div className="flex">
            <span className="font-semibold mr-1">{`Project:`}</span>
            <span className="font-normal">{data?.dataset?.project?.name}</span>
          </div>
          <div className="flex">
            <span className="font-semibold mr-1">{`Image name:`}</span>
            <span className="font-normal">{data?.name}</span>
          </div>
          <div className="flex">
            <span className="font-semibold mr-1">{`Image type:`}</span>
            <span className="font-normal">{data?.mimeType}</span>
          </div>
          <div className="flex">
            <span className="font-semibold mr-1">{`Dataset:`}</span>
            <span className="font-normal">{data?.dataset?.name}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default AnnotateImageInfo;
