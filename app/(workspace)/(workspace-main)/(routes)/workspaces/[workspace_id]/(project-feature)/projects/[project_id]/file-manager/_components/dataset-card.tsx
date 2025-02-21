import { Dataset } from '@/app/(workspace)/(workspace-main)/_types';
import { Folder, MoreVertical, Trash2 } from 'lucide-react';

interface DatasetCardProps {
  dataset?: Dataset;
  isAll?: boolean;
}

const DatasetCard = ({ dataset, isAll }: DatasetCardProps) => {
  return (
    <li className="flex relative w-full items-center border-b hover:bg-gray-100">
      <div className="w-full p-3 cursor-pointer">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-row items-center w-4/5">
            <Folder className="w-5 h-5" />
            <div className="ml-2 w-9/10">
              <span className="text-xs truncate">
                {isAll ? 'All Datasets' : dataset?.name}
              </span>
            </div>
          </div>
          {isAll && (
            <div className="flex flex-row w-1/5">
              <p className="text-xs">{15} images</p>
            </div>
          )}
          {!isAll && (
            <div className="flex flex-row w-1/5">
              <button className="p-2 hover:bg-slate-200">
                <Trash2 className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-slate-200">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default DatasetCard;
