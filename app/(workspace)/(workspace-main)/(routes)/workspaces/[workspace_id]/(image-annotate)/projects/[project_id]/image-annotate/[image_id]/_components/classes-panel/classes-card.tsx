'use client';

import { Button } from '@/components/ui/button';
import { DiameterIcon } from 'lucide-react';
import { LabelClass } from '../../_types/label-class';

type ClassesCardProps = {
  label: LabelClass;
};

const ClassesCard = ({ label }: ClassesCardProps) => {
  return (
    <div
      className="flex relative items-center min-h-9 hover:bg-black hover:bg-opacity-5
        cursor-pointer"
    >
      <Button
        variant="ghost"
        size="icon"
        className="w-7 h-7 rounded-none hover:bg-blue-600 hover:bg-opacity-20"
      >
        <DiameterIcon className="w-3 h-3" />
      </Button>
      <label
        aria-label="classes color"
        className={'ml-2 w-4 h-4 rounded-[4px] relative opacity-60'}
        style={{ background: `${label.color}` }}
      />
      <div className="flex-1 ml-2">
        <div className="flex justify-between items-center">
          <div className="w-40 flex items-center">
            <p className="text-xs font-normal overflow-hidden text-ellipsis whitespace-nowrap">
              {label.name}
            </p>
          </div>
          <p className="text-xs text-gray-400 mr-1">{`(0 labels)`}</p>
        </div>
      </div>
    </div>
  );
};

export default ClassesCard;
