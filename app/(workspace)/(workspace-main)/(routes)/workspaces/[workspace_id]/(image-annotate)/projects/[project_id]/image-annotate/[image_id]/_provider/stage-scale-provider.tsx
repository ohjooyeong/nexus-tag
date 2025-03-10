import React, { useLayoutEffect, useState } from 'react';
import { useKonvaStage } from './konva-stage-context-provider';

type StageScaleProviderProps = {
  children: (scale: number) => React.ReactElement;
};

export const StageScaleProvider: (
  props: StageScaleProviderProps,
) => React.ReactElement = ({ children }) => {
  const stage = useKonvaStage();
  const [scale, setScale] = useState(stage?.scaleX() || 1);
  useLayoutEffect(() => {
    if (!stage) {
      return;
    }
    const scale = stage.scaleX();
    setScale(scale);
    const cb = (e: any) => {
      setScale(e.newVal.x);
    };
    stage.on('scaleChange', cb);

    return () => {
      stage.off('scaleChange', cb);
    };
  }, [stage]);

  return children(scale);
};
