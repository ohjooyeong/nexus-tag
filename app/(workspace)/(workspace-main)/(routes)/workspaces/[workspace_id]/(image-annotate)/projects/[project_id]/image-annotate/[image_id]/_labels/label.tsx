import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ImageLabel } from '../_types/image-label';
import { LabelClass } from '../_types/label-class';
import { KonvaEventObject } from 'konva/lib/Node';
import { useCanvasDimensions } from '../_provider/canvas-dimensions-context-provider';
import { useToolStore } from '../_store/tool-store';
import { usePanningStore } from '../_store/panning-store';
import { Bbox, Tool } from '../_types/types';
import { useSelectedLabelsStore } from '../_store/label-collection/selected-labels-store';
import { useClassLabelStore } from '../_store/class-label-store';
import { useHoveredLabelsStore } from '../_store/label-collection/hovered-labels-store';
import { getColors } from './style';
import { useImageClamping } from '../_provider/image-clamping-context-provider';
import Konva from 'konva';
import { getBboxDimensions } from '../_helpers/image-view/common.helpers';
import Box from './box';
import { DRAG_DISTANCE } from '../_constants/constants';
import CursorSetter from './cursor-setter';
import chroma from 'chroma-js';

type LabelProps = {
  label: ImageLabel;
  labelClass?: LabelClass | null;
  onDragStart?: (e: KonvaEventObject<MouseEvent>) => void;
  onDragEnd?: (e: KonvaEventObject<MouseEvent>) => void;
};

const Label = ({ label, labelClass, onDragStart, onDragEnd }: LabelProps) => {
  const { absoluteScale } = useCanvasDimensions();
  const { getToolId } = useToolStore();
  const { getEnabledPanning } = usePanningStore();
  const {
    isLabelSelected,
    toggleLabelSelection,
    setSelectedLabelIds,
    isLabelSingleSelected,
  } = useSelectedLabelsStore();
  const { isClassLabelHovered } = useClassLabelStore();
  const { resetHoveredLabel, setHoveredLabel } = useHoveredLabelsStore();

  const [hovered, setHovered] = useState(false);
  const [isDragged, setIsDragged] = useState(false);

  const color = chroma(labelClass?.color ?? '#000000')
    .alpha(0.55)
    .hex();
  const activeToolId = getToolId();
  const panningEnabled = getEnabledPanning();
  const isSelection = activeToolId === Tool.Selection;
  const selected = isLabelSelected(label.id);
  const draggable = activeToolId !== Tool.Pan && !panningEnabled && !selected;
  const classLabelHovered = isClassLabelHovered(label.classLabelId!);
  const exclusivelySelected = isLabelSingleSelected(label.id);

  const timeoutRef = useRef<number | null>(null);

  const resetHover = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    resetHoveredLabel();
  }, [resetHoveredLabel]);

  const handleClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (e.evt.button !== 0 || activeToolId === Tool.Pan) {
        return;
      }
      if (e.evt.shiftKey) {
        toggleLabelSelection(e.currentTarget.attrs.id);
      } else {
        setSelectedLabelIds([e.currentTarget.attrs.id]);
      }
      resetHover();
    },
    [activeToolId, resetHover, toggleLabelSelection, setSelectedLabelIds],
  );

  const handleOnMouseOver = useCallback(() => {
    if (activeToolId === Tool.Pan) return;
    setHovered(true);
    if (label.classLabelId) {
      timeoutRef.current = window.setTimeout(() => {
        if (timeoutRef.current && label.classLabelId) {
          setHoveredLabel({
            id: label.id,
            classLabelId: label.classLabelId,
            zIndex: label.zIndex,
          });
        }
      }, 375);
    }
  }, [
    activeToolId,
    setHoveredLabel,
    label.classLabelId,
    label.id,
    label.zIndex,
  ]);

  const handleOnMouseOut = useCallback(() => {
    if (activeToolId === Tool.Pan) return;
    setHovered(false);
    resetHover();
  }, [activeToolId, resetHover]);

  const handleDragStart = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (onDragStart) {
        onDragStart(e);
      }
      setIsDragged(true);
    },
    [onDragStart],
  );

  const handleDragEnd = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (onDragEnd) {
        onDragEnd(e);
      }
      setIsDragged(false);
    },
    [onDragEnd],
  );

  const { fill, stroke, dash, strokeWidth } = useMemo(
    () =>
      getColors({
        selected: isSelection ? selected : false,
        hovered: hovered || classLabelHovered,
        color,
        isFilled: false,
      }),
    [hovered, color, isSelection, selected, classLabelHovered],
  );

  const { restrictEntityToImage } = useImageClamping();

  const handleDragBound = useCallback(
    (pos: Konva.Vector2d) =>
      restrictEntityToImage(
        pos,
        label.bbox
          ? getBboxDimensions(label.bbox.map((n) => n * absoluteScale) as Bbox)
          : null,
      ),
    [absoluteScale, label.bbox, restrictEntityToImage],
  );

  useEffect(() => resetHover, [resetHover]);

  let LabelComponent;

  if (!label.polygon && !label.mask)
    LabelComponent = (
      <Box
        absoluteScale={absoluteScale}
        label={label}
        onClick={handleClick}
        draggable={draggable}
        dragDistance={DRAG_DISTANCE}
        resizable={isSelection ? exclusivelySelected : false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        dragBoundFunc={handleDragBound}
        onMouseOver={handleOnMouseOver}
        onMouseOut={handleOnMouseOut}
        fill={fill}
        stroke={stroke}
        isDragged={isDragged}
        dash={dash}
        strokeWidth={strokeWidth}
      />
    );

  return (
    <>
      {hovered ? <CursorSetter cursor="pointer" /> : null}
      {LabelComponent}
    </>
  );
};

export default Label;
