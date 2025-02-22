import { Folder } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

interface DatasetCardProps {
  totalDatasets: number;
  totalItems: number;
}

const DatasetCardAll = ({ totalDatasets, totalItems }: DatasetCardProps) => {
  const router = useRouter();
  const { workspace_id: workspaceId, project_id: projectId } = useParams();

  return (
    <li
      className="flex relative w-full items-center border-b hover:bg-gray-100"
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
