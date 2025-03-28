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
import useLabelSync from '../../_hooks/use-label-sync';

const ImageViewContainer = () => {
  const [imageObjectId, setImageObjectId] = useState(0);
  const { width, height, ref } = useResizeDetector({});
  const { image_id: imageId } = useParams();

  // 라벨 싱크
  useLabelSync();

  // 라벨 초기화
  useInitialLabels();

  const { data: dataItem } = useDataItem();

  const { setZoom } = useZoomStore();
  const { processAndStoreImage, setImageId } = useImageStore();
  const { getAvaliableLabels } = useLabelsStore();

  const labels = getAvaliableLabels();

  const handleResetStore = () => {
    setZoom(1);
  };

  useEffect(() => {
    const loadImage = async () => {
      if (!dataItem?.fileUrl) return;

      try {
        // fileUrl이 이미 전체 URL인 경우와 상대 경로인 경우를 처리
        const imageUrl = dataItem.fileUrl;
        const id = await processAndStoreImage(imageUrl);

        setImageObjectId(id);
        handleResetStore();
      } catch (error) {
        console.error('Failed to process image:', error);
      }
    };

    loadImage();
  }, [dataItem, processAndStoreImage, imageId]);

  useEffect(() => {
    if (imageId) {
      setImageId(imageId as string);
    }
  }, [imageId, setImageId]);

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
