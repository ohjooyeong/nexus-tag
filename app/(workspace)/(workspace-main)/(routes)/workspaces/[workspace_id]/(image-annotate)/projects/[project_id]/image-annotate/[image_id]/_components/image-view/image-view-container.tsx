'use client';

import { useResizeDetector } from 'react-resize-detector';
import ImageSubToolbar from './image-sub-toolbar';

import ImageView from './image-view';
import { useImageStore } from '../../_store/image-store';
import { useEffect, useState } from 'react';
import useDataItem from '../../_hooks/use-data-item';
import { useParams } from 'next/navigation';
import { useZoomStore } from '../../_store/zoom-store';
import { useInitialLabels } from '../../_hooks/use-labels';
import { useLabelsStore } from '../../_store/label-collection/labels-store';

const ImageViewContainer = () => {
  const [imageObjectId, setImageObjectId] = useState(0);
  const { width, height, ref } = useResizeDetector({});
  const { image_id: imageId } = useParams();

  useInitialLabels();

  const { data: dataItem } = useDataItem();

  const { setZoom } = useZoomStore();
  const { processAndStoreImage } = useImageStore();
  const { getLabels } = useLabelsStore();

  const labels = getLabels();

  const handleResetStore = () => {
    setZoom(1);
  };

  useEffect(() => {
    const loadImage = async () => {
      if (!dataItem?.fileUrl) return;

      try {
        const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${dataItem?.fileUrl}`;
        const id = await processAndStoreImage(imageUrl);

        setImageObjectId(id);
        handleResetStore();
      } catch (error) {
        console.error('Failed to process image:', error);
      }
    };

    loadImage();
  }, [dataItem, processAndStoreImage, imageId]);

  return (
    <>
      <ImageSubToolbar />
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <div className="flex flex-1 h-full overflow-hidden relative">
          <div className="flex-1 overflow-hidden bg-slate-300" ref={ref}>
            {dataItem?.fileUrl && width && height && (
              <ImageView
                containerWidth={width}
                containerHeight={height}
                imageObjectId={imageObjectId}
                labels={labels}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageViewContainer;
