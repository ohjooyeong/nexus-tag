'use client';

import { Loader2, FileText, Check, CheckCircle2 } from 'lucide-react';
import useLabelSync from '../_hooks/use-label-sync';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const AnnotateAction = () => {
  const { stage } = useLabelSync();

  return (
    <div className="flex items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="relative">
                <FileText className="h-5 w-5" />
                <div className="absolute bottom-[-4px] right-[-4px]">
                  {stage === 'saving' && (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  )}
                  {stage === 'dirty' && (
                    <div className="h-2 w-2 rounded-full bg-yellow-400" />
                  )}
                  {stage === 'saved' && (
                    <div className="flex h-3 w-3 items-center justify-center rounded-full bg-green-500">
                      <Check className="h-2 w-2 text-white" />
                    </div>
                  )}
                  {stage === 'initialized' && (
                    <div className="flex h-3 w-3 items-center justify-center rounded-full bg-blue-500">
                      <CheckCircle2 className="h-2 w-2 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {stage === 'saving' && 'Saving changes...'}
            {stage === 'dirty' && 'Changes pending...'}
            {stage === 'saved' && <>Saved a minute ago</>}
            {stage === 'initialized' && <>Ready to edit</>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default AnnotateAction;
