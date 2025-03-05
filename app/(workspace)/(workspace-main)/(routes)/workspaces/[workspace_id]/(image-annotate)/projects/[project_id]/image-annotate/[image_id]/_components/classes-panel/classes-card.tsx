'use client';

import { Button } from '@/components/ui/button';
import {
  DiameterIcon,
  Edit2Icon,
  EyeIcon,
  EyeOffIcon,
  Trash,
} from 'lucide-react';
import { LabelClass } from '../../_types/label-class';
import { useState } from 'react';
import UpdateClassLabelDialog from '../dialog/update-classes-dialog';
import { cn } from '@/lib/utils';
import useWorkspaceMyRole from '@/app/(workspace)/(workspace-main)/_hooks/use-workspace-my-role';

type ClassesCardProps = {
  label: LabelClass;
};

const ClassesCard = ({ label }: ClassesCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isHide, setIsHide] = useState(false);
  const [showLabelDialog, setShowLabelDialog] = useState(false);

  const { data: currentMyRole } = useWorkspaceMyRole();

  const isMyRoleOwnerOrManager =
    currentMyRole === 'OWNER' || currentMyRole === 'MANAGER';

  return (
    <div
      className={cn(
        `flex relative items-center min-h-9 hover:bg-black hover:bg-opacity-5
        cursor-pointer`,
        isHide && 'opacity-60',
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        <div className="flex justify-between items-center relative">
          <div className="w-40 flex items-center">
            <p className="text-xs font-normal overflow-hidden text-ellipsis whitespace-nowrap">
              {label.name}
            </p>
          </div>
          {isHovered ? (
            <div className="absolute flex items-center right-2">
              <Button
                variant={'ghost'}
                className="w-6 h-6 text-gray-400 hover:text-blue-500"
                size={'icon'}
                onClick={() => {
                  setIsHide((prev) => !prev);
                }}
              >
                {isHide ? (
                  <EyeIcon className="w-4 h-4" />
                ) : (
                  <EyeOffIcon className="w-4 h-4" />
                )}
              </Button>
              {isMyRoleOwnerOrManager && (
                <>
                  <Button
                    variant={'ghost'}
                    className="w-6 h-6 text-gray-400 hover:text-blue-500"
                    size={'icon'}
                    onClick={() => {
                      setShowLabelDialog(true);
                    }}
                  >
                    <Edit2Icon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={'ghost'}
                    className="w-6 h-6 text-gray-400 hover:text-blue-500"
                    size={'icon'}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400 mr-1">{`(0 labels)`}</p>
          )}
        </div>
      </div>
      {showLabelDialog && (
        <UpdateClassLabelDialog
          isOpen={showLabelDialog}
          onClose={() => {
            setShowLabelDialog(false);
          }}
          currentClassLabel={label}
        />
      )}
    </div>
  );
};

export default ClassesCard;
