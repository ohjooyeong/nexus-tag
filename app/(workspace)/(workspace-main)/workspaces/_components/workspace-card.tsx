import { Button } from '@/components/ui/button';
import {
  FolderIcon,
  ImageIcon,
  MoreVerticalIcon,
  PinIcon,
  User2Icon,
} from 'lucide-react';
import Link from 'next/link';

const WorkspaceCard = () => {
  return (
    <div className="w-60 h-56 relative rounded-2xl overflow-hidden shadow border hover:bg-muted">
      <Link href={'#'} className="w-full h-full">
        <span className="absolute top-0 left-0 w-full h-full rounded-2xl"></span>
      </Link>
      <div className="absolute top-3 left-3 right-3">
        <div className="flex justify-between">
          <div className="rounded-lg p-1 border flex items-center bg-white">
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
            <span className="ml-1 text-[10px]/[12px] text-card-foreground">
              Image Project
            </span>
          </div>
        </div>
      </div>
      <Button
        className="w-6 h-6 p-3 flex items-center justify-center top-3 right-3 absolute bg-white
          hover:bg-slate-100 border"
      >
        <PinIcon className="w-3 h-3 text-muted-foreground" />
      </Button>
      <div
        className="absolute bottom-3 left-3 right-3 rounded-lg px-3 py-[6px] text-card-foreground
          border bg-white"
      >
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <div className="max-w-36 flex items-center">
              <span className="text-sm font-bold overflow-hidden whitespace-nowrap text-ellipsis">
                <b>Project Namedsfdsfdsfsfsdsfdsdsfsdfs</b>
              </span>
            </div>
            <MoreVerticalIcon className="w-4 h-4 ml-2 text-muted-foreground" />
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex justify-between items-center text-xs">
              <FolderIcon className="w-3 h-3 text-muted-foreground" />
              <span className="ml-1">55</span>
              <span className="ml-1">images</span>
            </div>
            <div className="flex justify-between items-center ml-2">
              <User2Icon className="w-3 h-3 text-muted-foreground" />
              <span className="ml-1 text-xs">Owner</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCard;
