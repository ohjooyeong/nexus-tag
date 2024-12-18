import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const AnnotateImageInfo = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <span className="pl-4 text-sm font-normal text-gray-700">image-1</span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <div className="flex flex-col gap-4 p-2">
          <div className="flex">
            <span className="font-semibold mr-1">{`Project:`}</span>
            <span className="font-normal">image-chapter123</span>
          </div>
          <div className="flex">
            <span className="font-semibold mr-1">{`Image name:`}</span>
            <span className="font-normal">image-1</span>
          </div>
          <div className="flex">
            <span className="font-semibold mr-1">{`Image size:`}</span>
            <span className="font-normal">1920x1024</span>
          </div>
          <div className="flex">
            <span className="font-semibold mr-1">{`Dataset:`}</span>
            <span className="font-normal">image-dataset</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default AnnotateImageInfo;
