import { cn } from '@/lib/utils';
import { Folder } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

interface DatasetCardProps {
  totalDatasets: number;
  totalItems: number;
}

const DatasetCardAll = ({ totalDatasets, totalItems }: DatasetCardProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { workspace_id: workspaceId, project_id: projectId } = useParams();

  const datasetId = searchParams.get('datasetId');

  return (
    <li
      className={cn(
        'flex relative w-full items-center border-b hover:bg-gray-100',
        !datasetId && 'bg-gray-100',
      )}
      onClick={() => {
        router.push(
          `/workspaces/${workspaceId}/projects/${projectId}/file-manager`,
        );
      }}
    >
      <div className="w-full p-3 cursor-pointer">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-row items-center w-4/5">
            <Folder className="w-5 h-5" />
            <div className="ml-2 w-9/10">
              <span className="text-xs truncate">{`All Datasets (${totalDatasets})`}</span>
            </div>
          </div>

          <div className="flex flex-row w-1/5">
            <p className="text-xs">{totalItems} images</p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default DatasetCardAll;
