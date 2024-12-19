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

const ClassesList = () => {
  const [isHideObjectClasses, setIsHideObjectClasses] = useState(false);
  const [isHideSementicClasses, setIsHideSementicClasses] = useState(false);
  const [isObjectOpen, setIsObjectOpen] = useState(true);
  const [isSementicOpen, setIsSementicOpen] = useState(true);

  const toggleHideObjectClasses = () => {
    setIsHideObjectClasses((prev) => !prev);
  };

  const toggleHideSementicClasses = () => {
    setIsHideSementicClasses((prev) => !prev);
  };

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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={'ghost'}
                        className="w-6 h-6"
                        size={'icon'}
                      >
                        <PlusIcon className="w-4 h-4 text-gray-600" />
                        <span className="sr-only">Create new object class</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Create new object class</TooltipContent>
                  </Tooltip>

                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-6 h-6">
                      <ChevronsUpDown className="h-4 w-4 text-gray-600" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
            </div>
            <CollapsibleContent className="py-2">
              <ClassesCard name="Car" color={'#231232'} totalLabel={0} />
              <ClassesCard name="Apt" color={'#f21521'} totalLabel={2} />
              <ClassesCard name="Home" color={'#a06065'} totalLabel={3} />
            </CollapsibleContent>
          </Collapsible>
          <Collapsible
            open={isSementicOpen}
            onOpenChange={setIsSementicOpen}
            className="w-full"
          >
            <div className="flex min-h-9 pr-2">
              <div className="flex flex-grow m-0 items-center">
                <p className="text-sm font-bold text-gray-400">
                  Sementic classes
                </p>
                <div className="flex justify-between ml-auto items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={'ghost'}
                        className="w-6 h-6"
                        size={'icon'}
                        onClick={toggleHideSementicClasses}
                      >
                        {isHideSementicClasses ? (
                          <EyeIcon className="w-4 h-4 text-gray-600" />
                        ) : (
                          <EyeOffIcon className="w-4 h-4 text-gray-600" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isHideSementicClasses
                        ? 'Show all sementic classes'
                        : 'Hide all sementic classes'}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={'ghost'}
                        className="w-6 h-6"
                        size={'icon'}
                      >
                        <PlusIcon className="w-4 h-4 text-gray-600" />
                        <span className="sr-only">
                          Create new sementic class
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Create new sementic class</TooltipContent>
                  </Tooltip>

                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-6 h-6">
                      <ChevronsUpDown className="h-4 w-4 text-gray-600" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
            </div>
            <CollapsibleContent className="py-2">
              <ClassesCard name="Car" color={'#231232'} totalLabel={0} />
              <ClassesCard name="Apt" color={'#f21521'} totalLabel={2} />
              <ClassesCard name="Home" color={'#a06065'} totalLabel={3} />
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};

export default ClassesList;
