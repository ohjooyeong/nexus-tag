import { useHotkeys } from 'react-hotkeys-hook';
import { Polygon } from '../../_types/types';
import { isPolygonValid } from '../../_helpers/polygon/polygon.helpers';

interface HistoryState<S> {
  history: S[];
  position: number;
  capacity: number;
  back: (amount?: number) => void;
  forward: (amount?: number) => void;
  go: (position: number) => void;
}

type UsePolygonToolShortcutsProps = {
  vertices: Polygon;
  setVertices: (vertices: Polygon) => void;
  verticesHistory: HistoryState<Polygon>;
  resetActiveTool: () => void;
  doSubmit: () => void;
  addVertex: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
};

export const usePolygonToolShortcuts = ({
  vertices,
  setVertices,
  verticesHistory,
  resetActiveTool,
  doSubmit,
  addVertex,
  undo,
  redo,
  canUndo,
  canRedo,
}: UsePolygonToolShortcutsProps) => {
  // ESC - Cancel/Exit
  useHotkeys(
    'esc',
    () => {
      if (vertices.length) {
        setVertices([]);
      } else {
        resetActiveTool();
      }
    },
    { scopes: 'polygon-tool' },
  );

  // Enter - Submit
  useHotkeys(
    'enter',
    () => {
      if (isPolygonValid(vertices)) {
        doSubmit();
      }
    },
    { scopes: 'polygon-tool' },
  );

  // Delete/Backspace - Remove last vertex
  useHotkeys(
    ['del', 'backspace'],
    () => {
      setVertices(
        vertices.length ? vertices.slice(0, vertices.length - 1) : vertices,
      );
    },
    { scopes: 'polygon-tool' },
  );

  // A - Add vertex
  useHotkeys(
    'a',
    () => {
      addVertex();
    },
    { scopes: 'polygon-tool' },
  );

  // Ctrl+Z - Undo
  useHotkeys(
    ['mod+z', 'ctrl+z'],
    () => {
      if (verticesHistory.position === 0 && canUndo()) {
        undo();
      } else {
        verticesHistory.back();
      }
    },
    { scopes: 'polygon-tool' },
  );

  // Ctrl+Shift+Z - Redo
  useHotkeys(
    ['shift+mod+z', 'shift+ctrl+z'],
    () => {
      if (
        verticesHistory.position === verticesHistory.history.length - 1 &&
        canRedo()
      ) {
        redo();
      } else {
        verticesHistory.forward();
      }
    },
    { scopes: 'polygon-tool' },
  );
};
