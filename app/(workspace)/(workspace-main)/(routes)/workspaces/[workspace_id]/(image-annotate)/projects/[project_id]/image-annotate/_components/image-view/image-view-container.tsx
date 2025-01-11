'use client';

import { useResizeDetector } from 'react-resize-detector';
import dynamic from 'next/dynamic';
import ImageViewNavbar from './image-view-navbar';
import { useParams } from 'next/navigation';

const DynamicImageView = dynamic(() => import('./image-view'), {
  ssr: false,
});

const ImageViewContainer = () => {
  const { project_id: projectId } = useParams();
  const imageObjectId = 0;
  const { width, height, ref } = useResizeDetector();

  return (
    <>
      <ImageViewNavbar />
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <div className="flex flex-1 h-full overflow-hidden relative">
          <div className="flex-1 overflow-hidden" ref={ref}>
            {width && height && (
              <DynamicImageView
                projectId={projectId as string}
                containerWidth={width}
                containerHeight={height}
                imageId=""
                imageObjectId={imageObjectId}
                labels={[]}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageViewContainer;
