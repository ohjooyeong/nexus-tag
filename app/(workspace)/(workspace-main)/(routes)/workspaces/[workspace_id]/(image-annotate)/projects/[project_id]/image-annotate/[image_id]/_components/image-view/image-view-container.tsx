'use client';

import { useResizeDetector } from 'react-resize-detector';
import ImageViewNavbar from './image-view-navbar';
import { useParams } from 'next/navigation';
import ImageView from './image-view';

const ImageViewContainer = () => {
  const { project_id: projectId } = useParams();
  const imageObjectId = 0;
  const { width, height, ref } = useResizeDetector({});

  return (
    <>
      <ImageViewNavbar />
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <div className="flex flex-1 h-full overflow-hidden relative">
          <div className="flex-1 overflow-hidden bg-slate-300" ref={ref}>
            {width && height && (
              <ImageView
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
