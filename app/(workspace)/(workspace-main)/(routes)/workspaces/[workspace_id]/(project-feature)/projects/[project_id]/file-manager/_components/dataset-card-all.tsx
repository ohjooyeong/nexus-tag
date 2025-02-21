import { Dataset } from '@/app/(workspace)/(workspace-main)/_types';
import { Folder, MoreVertical, Trash2 } from 'lucide-react';

interface DatasetCardProps {
  totalDatasets: number;
  totalItems: number;
}

const DatasetCardAll = ({ totalDatasets, totalItems }: DatasetCardProps) => {
  return (
    <li className="flex relative w-full items-center border-b hover:bg-gray-100">
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
