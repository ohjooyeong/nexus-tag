import { Layer, Rect } from 'react-konva';
import CursorSetter from '../../_components/cursor/cursor-setter';

type PanningProps = {
  width: number;
  height: number;
};

const Panning = ({ width, height }: PanningProps) => (
  <Layer>
    <CursorSetter cursor="grab" />
    <Rect width={width} height={height} />
  </Layer>
);

export default Panning;
