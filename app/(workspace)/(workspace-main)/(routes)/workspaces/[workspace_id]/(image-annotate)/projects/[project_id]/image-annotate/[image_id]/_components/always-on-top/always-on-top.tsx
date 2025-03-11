import Konva from 'konva';
import { useLayoutEffect, useRef } from 'react';
import { Group } from 'react-konva';
import { useKonvaStage } from '../../_provider/konva-stage-context-provider';

export const alwaysOnTopLayerName = 'top-layer';
export const alwaysOnTopGroupName = 'top-layer-group';

type AlwaysOnTopProps = {
  enabled: boolean;
  name: string;
  children: React.ReactNode;
};

const AlwaysOnTop = ({ children, enabled, name }: AlwaysOnTopProps) => {
  const outer = useRef<Konva.Group>(null);
  const inner = useRef<Konva.Group>(null);
  const stage = useKonvaStage();

  useLayoutEffect(() => {
    if (!inner.current) {
      return;
    }

    const newContainer = stage.findOne(`.${alwaysOnTopGroupName}`);
    if (enabled && newContainer) {
      inner.current.moveTo(newContainer);
      if (name === 'aot_selection') {
        inner.current.moveToTop();
      }
    } else {
      inner.current.moveTo(outer.current);
    }

    outer.current?.getLayer()?.batchDraw();
    if (newContainer) {
      newContainer.getLayer()?.batchDraw();
    }
  }, [enabled, name, stage]);

  useLayoutEffect(
    () => () => {
      inner.current?.destroy();
    },
    [],
  );

  return (
    <Group name={name} ref={outer}>
      <Group name="_inner_portal" ref={inner}>
        {children}
      </Group>
    </Group>
  );
};

export default AlwaysOnTop;
