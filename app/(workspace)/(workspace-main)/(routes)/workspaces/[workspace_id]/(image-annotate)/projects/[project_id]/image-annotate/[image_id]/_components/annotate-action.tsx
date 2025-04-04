'use client';

import {
  Loader2,
  FileText,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import useLabelSync from '../_hooks/use-label-sync';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import useDataItemNavigation from '../_hooks/use-data-item-navigation';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useUpdateDataItemStatus from '../_hooks/use-update-data-item-status';
import useDataItem from '../_hooks/use-data-item';
import { useQueryClient } from '@tanstack/react-query';
import { dataItemQueries } from '@/constants/querykey-factory';
import { toast } from 'sonner';
import useWorkspaceMyRole from '@/app/(workspace)/(workspace-main)/_hooks/use-workspace-my-role';
import { STATUS_OPTIONS } from '../_constants/constants';

const AnnotateAction = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { stage } = useLabelSync();
  const { data } = useDataItemNavigation();
  const { data: currentItem } = useDataItem();
  const {
    workspace_id: workspaceId,
    project_id: projectId,
    image_id: imageId,
  } = useParams();

  const { data: currentMyRole } = useWorkspaceMyRole();

  const updateStatus = useUpdateDataItemStatus();

  const navigation = data?.navigation;
  const currentStatus = currentItem?.status || 'NEW';

  const handleNavigation = (itemId: string) => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(/\/[^/]+$/, `/${itemId}`);
    router.push(newPath);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!imageId) return;

    try {
      const response = await updateStatus.mutateAsync({
        workspaceId: workspaceId as string,
        projectId: projectId as string,
        imageId: imageId as string,
        status: newStatus,
      });

      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: dataItemQueries.default() });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getAvailableStatusOptions = () => {
    if (currentMyRole === 'OWNER' || currentMyRole === 'MANAGER') {
      return STATUS_OPTIONS;
    }

    if (currentMyRole === 'WORKER') {
      if (currentStatus === 'NEW' || currentStatus === 'IN_PROGRESS') {
        return STATUS_OPTIONS.filter((status) =>
          ['IN_PROGRESS', 'TO_REVIEW'].includes(status.value),
        );
      }
    }

    if (currentMyRole === 'REVIEWER') {
      if (currentStatus === 'TO_REVIEW') {
        return STATUS_OPTIONS.filter((status) =>
          ['DONE'].includes(status.value),
        );
      }
    }

    return [];
  };

  const availableStatusOptions = getAvailableStatusOptions();
  const canChangeStatus = availableStatusOptions.length > 0;

  return (
    <div className="flex items-center gap-4">
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
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          disabled={!navigation?.previousId}
          onClick={() =>
            navigation.previousId && handleNavigation(navigation.previousId)
          }
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm text-muted-foreground min-w-[80px] text-center">
          {navigation?.currentPage || ' '} / {navigation?.totalItems || ' '}
        </span>

        <Button
          variant="ghost"
          size="icon"
          disabled={!navigation?.nextId}
          onClick={() =>
            navigation.nextId && handleNavigation(navigation.nextId)
          }
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      {currentMyRole !== 'VIEWER' && (
        <Select
          value={currentStatus}
          onValueChange={handleStatusChange}
          disabled={updateStatus.isPending || !canChangeStatus}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableStatusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default AnnotateAction;
