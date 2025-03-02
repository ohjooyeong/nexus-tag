'use client';

import { useResizeDetector } from 'react-resize-detector';
import ImageViewNavbar from './image-sub-toolbar';

import ImageView from './image-view';
import { useImageStore } from '../../_store/image-store';
import { useEffect, useState } from 'react';
import useDataItem from '../../_hooks/use-data-item';

const ImageViewContainer = () => {
  const [imageObjectId, setImageObjectId] = useState(0);
  const { width, height, ref } = useResizeDetector({});

  const { data: dataItem } = useDataItem();

  const { processAndStoreImage } = useImageStore();

  useEffect(() => {
    const loadImage = async () => {
      if (!dataItem?.fileUrl) return;

      try {
        const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${dataItem?.fileUrl}`;
        const id = await processAndStoreImage(imageUrl);
        setImageObjectId(id);
      } catch (error) {
        console.error('Failed to process image:', error);
      }
    };

    loadImage();
  }, [dataItem]);

  return (
    <>
      <ImageViewNavbar />
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        <div className="flex flex-1 h-full overflow-hidden relative">
          <div className="flex-1 overflow-hidden bg-slate-300" ref={ref}>
            {dataItem?.fileUrl && width && height && (
              <ImageView
                containerWidth={width}
                containerHeight={height}
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
