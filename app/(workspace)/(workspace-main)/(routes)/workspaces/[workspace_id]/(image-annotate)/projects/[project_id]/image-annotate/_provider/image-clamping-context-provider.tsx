import React, { createContext, useContext, useMemo } from 'react';
import { Vector2d } from 'konva/lib/types';
import { useCanvasDimensions } from './canvas-dimensions-context-provider';
import { useKonvaStage } from './konva-stage-context-provider';

type ImageClampingFunctions = {
  restrictEntityToImage(
    pos: Vector2d,
    dimensions?: { width: number; height: number } | null,
  ): Vector2d;
  isPositionInImageBounds(pos?: Vector2d): boolean;
  getClosestPositionInImageBounds(pos?: Vector2d): Vector2d;
};

export const ImageClampingContext = createContext<ImageClampingFunctions>({
  restrictEntityToImage: () => ({ x: 0, y: 0 }),
  isPositionInImageBounds: () => false,
  getClosestPositionInImageBounds: () => ({ x: 0, y: 0 }),
});

export const ImageClampingContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { imageWidth, imageHeight } = useCanvasDimensions();
  const stage = useKonvaStage();

  const callbacks = useMemo<ImageClampingFunctions>(
    () => ({
      restrictEntityToImage(pos, dimensions) {
        let { x, y } = pos;
        const scale = stage.scaleX();

        const stageX = stage.x();
        const stageY = stage.y();

        if (x < stageX) {
          x = stageX;
        }
        if (y < stageY) {
          y = stageY;
        }

        const width = (dimensions?.width || 0) * scale;
        const height = (dimensions?.height || 0) * scale;
        const scaledImageWidth = imageWidth * scale;
        const scaledImageHeight = imageHeight * scale;

        if (x + width - stageX > scaledImageWidth) {
          x = scaledImageWidth - width + stageX;
        }
        if (y + height - stageY > scaledImageHeight) {
          y = scaledImageHeight - height + stageY;
        }

        return { x, y };
      },
      isPositionInImageBounds(pos) {
        const position = pos || stage.getPointerPosition();
        if (!position) {
          return false;
        }
        const { x, y } = position;
        const scale = stage.scaleX();

        const stageX = stage.x();
        const stageY = stage.y();

        if (x < stageX) {
          return false;
        }
        if (y < stageY) {
          return false;
        }

        const scaledImageWidth = imageWidth * scale;
        const scaledImageHeight = imageHeight * scale;

        if (x - stageX > scaledImageWidth) {
          return false;
        }

        return y - stageY <= scaledImageHeight;
      },
      getClosestPositionInImageBounds(pos) {
        const position = pos || stage.getPointerPosition();
        if (!position) {
          return { x: 0, y: 0 };
        }
        let { x, y } = position;
        const scale = stage.scaleX();

        const stageX = stage.x();
        const stageY = stage.y();

        if (x < stageX) {
          x = stageX;
        }
        if (y < stageY) {
          y = stageY;
        }

        const scaledImageWidth = imageWidth * scale;
        const scaledImageHeight = imageHeight * scale;

        if (x - stageX > scaledImageWidth) {
          x = scaledImageWidth + stageX;
        }
        if (y - stageY > scaledImageHeight) {
          y = scaledImageHeight + stageY;
        }

        return { x, y };
      },
    }),
    [imageHeight, imageWidth, stage],
  );

  return (
    <ImageClampingContext.Provider value={callbacks}>
      {children}
    </ImageClampingContext.Provider>
  );
};

export const useImageClamping = () => useContext(ImageClampingContext);
