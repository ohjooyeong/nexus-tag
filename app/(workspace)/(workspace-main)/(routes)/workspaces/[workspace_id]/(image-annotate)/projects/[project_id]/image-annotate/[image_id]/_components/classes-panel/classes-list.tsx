'use client';

import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, EyeIcon, EyeOffIcon, PlusIcon } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import ClassesCard from './classes-card';
import { LabelClass, LabelClassType } from '../../_types/label-class';
import { cn } from '@/lib/utils';
import NewClassLabelDialog from '../dialog/new-classes-dialog';
import useWorkspaceMyRole from '@/app/(workspace)/(workspace-main)/_hooks/use-workspace-my-role';

interface DatasetCardProps {
  filteredClassLabels: LabelClass[];
}

const ClassesList = ({ filteredClassLabels = [] }: DatasetCardProps) => {
  const [isHideObjectClasses, setIsHideObjectClasses] = useState(false);
  const [isHideSemanticClasses, setIsHideSemanticClasses] = useState(false);
  const [isObjectOpen, setIsObjectOpen] = useState(true);
  const [isSemanticOpen, setIsSemanticOpen] = useState(true);
  const [showNewLabelDialog, setShowNewLabelDialog] = useState(false);
  const [LabelType, setLabelType] = useState<LabelClassType>(
    LabelClassType.OBJECT,
  );

  const { data: currentMyRole } = useWorkspaceMyRole();

  const isMyRoleOwnerOrManager =
    currentMyRole === 'OWNER' || currentMyRole === 'MANAGER';

  const toggleHideObjectClasses = () => {
    setIsHideObjectClasses((prev) => !prev);
  };

  const toggleHideSemanticClasses = () => {
    setIsHideSemanticClasses((prev) => !prev);
  };

  const filteredObjectLabels = filteredClassLabels?.filter(
    (label) => label.type === 'OBJECT' && !isHideObjectClasses,
  );

  const filteredSemanticLabels = filteredClassLabels?.filter(
    (label) => label.type === 'SEMANTIC' && !isHideSemanticClasses,
  );

  return (
    <div className="relative transition-all">
      <div className="overflow-visible h-auto min-h-0">
        <div className="flex w-full flex-col">
          <Collapsible
            open={isObjectOpen}
            onOpenChange={setIsObjectOpen}
            className="w-full"
          >
            <div className="flex min-h-9 pr-2">
              <div className="flex flex-grow m-0 items-center">
                <p className="text-sm font-bold text-gray-400">
                  Object classes
                </p>
                <div className="flex justify-between ml-auto items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={'ghost'}
                        className="w-6 h-6"
                        size={'icon'}
                        onClick={toggleHideObjectClasses}
                      >
                        {isHideObjectClasses ? (
                          <EyeIcon className="w-4 h-4 text-gray-600" />
                        ) : (
                          <EyeOffIcon className="w-4 h-4 text-gray-600" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isHideObjectClasses
                        ? 'Show all object classes'
                        : 'Hide all object classes'}
                    </TooltipContent>
                  </Tooltip>
                  {isMyRoleOwnerOrManager && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={'ghost'}
                          className="w-6 h-6"
                          size={'icon'}
                          onClick={() => {
                            setShowNewLabelDialog(true);
                            setLabelType(LabelClassType.OBJECT);
                          }}
                        >
                          <PlusIcon className="w-4 h-4 text-gray-600" />
                          <span className="sr-only">
                            Create new object class
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Create new object class</TooltipContent>
                    </Tooltip>
                  )}

                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'w-6 h-6',
                        !isObjectOpen && 'bg-slate-200 hover:bg-slate-200',
                      )}
                    >
                      <ChevronsUpDown className="h-4 w-4 text-gray-600" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
            </div>
            <CollapsibleContent className="py-2 max-h-80 overflow-auto z-50">
              {filteredObjectLabels?.length === 0 ? (
                <div className="flex justify-center text-sm text-gray-500 p-1 bg-slate-100 rounded-sm">
                  {'No Labels'}
                </div>
              ) : (
                filteredObjectLabels.map((label) => (
                  <ClassesCard key={label.id} label={label} />
                ))
              )}
            </CollapsibleContent>
          </Collapsible>
          <Collapsible
            open={isSemanticOpen}
            onOpenChange={setIsSemanticOpen}
            className="w-full"
          >
            <div className="flex min-h-9 pr-2">
              <div className="flex flex-grow m-0 items-center">
                <p className="text-sm font-bold text-gray-400">
                  Semantic classes
                </p>
                <div className="flex justify-between ml-auto items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={'ghost'}
                        className="w-6 h-6"
                        size={'icon'}
                        onClick={toggleHideSemanticClasses}
                      >
                        {isHideSemanticClasses ? (
                          <EyeIcon className="w-4 h-4 text-gray-600" />
                        ) : (
                          <EyeOffIcon className="w-4 h-4 text-gray-600" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isHideSemanticClasses
                        ? 'Show all semantic classes'
                        : 'Hide all semantic classes'}
                    </TooltipContent>
                  </Tooltip>
                  {isMyRoleOwnerOrManager && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={'ghost'}
                          className="w-6 h-6"
                          size={'icon'}
                          onClick={() => {
                            setShowNewLabelDialog(true);
                            setLabelType(LabelClassType.SEMANTIC);
                          }}
                        >
                          <PlusIcon className="w-4 h-4 text-gray-600" />
                          <span className="sr-only">
                            Create new semantic class
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Create new semantic class</TooltipContent>
                    </Tooltip>
                  )}

                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'w-6 h-6',
                        !isSemanticOpen && 'bg-slate-200 hover:bg-slate-200',
                      )}
                    >
                      <ChevronsUpDown className="h-4 w-4 text-gray-600" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
            </div>
            <CollapsibleContent className="py-2 max-h-80 overflow-auto z-50">
              {filteredSemanticLabels?.length === 0 ? (
                <div className="flex justify-center text-sm text-gray-500 p-1 bg-slate-100 rounded-sm">
                  {'No Labels'}
                </div>
              ) : (
                filteredSemanticLabels.map((label) => (
                  <ClassesCard key={label.id} label={label} />
                ))
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
      {showNewLabelDialog && (
        <NewClassLabelDialog
          isOpen={showNewLabelDialog}
          onClose={() => {
            setShowNewLabelDialog(false);
          }}
          currentType={LabelType}
        />
      )}
    </div>
  );
};

export default ClassesList;
