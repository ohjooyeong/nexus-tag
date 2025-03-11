import { useEffect } from 'react';
import { useKonvaStage } from '../../_provider/konva-stage-context-provider';
import { builtInCursors, customCursors } from '../../_constants/cursors';

type CustomCursorKey = keyof typeof customCursors;

const CursorSetter = ({
  cursor: cursorName,
}: {
  cursor: CustomCursorKey | (typeof builtInCursors)[number];
}) => {
  const stage = useKonvaStage();

  useEffect(() => {
    setTimeout(() => {
      stage.container().style.cursor = customCursors[
        cursorName as CustomCursorKey
      ]
        ? `url(${customCursors[cursorName as CustomCursorKey]}), auto`
        : cursorName;
    }, 0);

    return () => {
      stage.container().style.cursor = 'auto';
    };
  }, [cursorName, stage]);

  return null;
};

export default CursorSetter;
