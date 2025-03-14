import React, { useCallback, useEffect, useState } from 'react';
import { Line } from 'react-konva';
import { useKonvaStage } from '../../_provider/konva-stage-context-provider';
import { useCanvasDimensions } from '../../_provider/canvas-dimensions-context-provider';
import { getStagePointerCoordinatesSnappedToPixel } from '../../_helpers/image-view/common.helpers';
import { StageScaleProvider } from '../../_provider/stage-scale-provider';

const CursorCrosshair = () => {
  const { imageHeight, imageWidth, absoluteScale } = useCanvasDimensions();
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const stage = useKonvaStage();

  const handleMouseMove = useCallback(() => {
    const coords = getStagePointerCoordinatesSnappedToPixel(
      stage,
      absoluteScale,
    );

    if (coords) {
      setCursorPosition(coords);
    }
  }, [absoluteScale, stage]);

  useEffect(() => {
    handleMouseMove();
  }, [handleMouseMove]);

  useEffect(() => {
    stage.on('mousemove.crosshair', handleMouseMove);
    stage.on('dragmove.crosshair', handleMouseMove);

    return () => {
      stage.off('mousemove.crosshair');
      stage.off('dragmove.crosshair');
    };
  }, [handleMouseMove, stage]);

  return (
    <StageScaleProvider>
      {(scale) => (
        <>
          <Line
            hitStrokeWidth={0}
            points={[0, cursorPosition.y, imageWidth, cursorPosition.y]}
            strokeWidth={1 / scale}
            stroke="white"
          />
          <Line
            hitStrokeWidth={0}
            points={[cursorPosition.x, 0, cursorPosition.x, imageHeight]}
            strokeWidth={1 / scale}
            stroke="white"
          />
          <Line points={[]} strokeWidth={1} stroke="white" />
        </>
      )}
    </StageScaleProvider>
  );
};

export default CursorCrosshair;
