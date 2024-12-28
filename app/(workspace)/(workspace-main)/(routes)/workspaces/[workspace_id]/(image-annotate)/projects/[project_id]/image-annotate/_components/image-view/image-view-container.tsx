'use client';

import { useResizeDetector } from 'react-resize-detector';
import dynamic from 'next/dynamic';
import ImageViewNavbar from './image-view-navbar';

const DynamicImageView = dynamic(() => import('./image-view'), {
  ssr: false,
});

type ImageViewContainerProps = {
  params: { project_id: string };
};

const ImageViewContainer = ({ params }: ImageViewContainerProps) => {
  const { project_id: projectId } = params;
  const { width, height, ref } = useResizeDetector();

  return (
    <>
      <ImageViewNavbar />
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <div className="flex flex-1 h-full overflow-hidden relative">
          <div className="flex-1 overflow-hidden" ref={ref}>
            {width && height && (
              <DynamicImageView
                projectId={projectId}
                containerWidth={width}
                containerHeight={height}
                imageId=""
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
