import { useHotkeys } from 'react-hotkeys-hook';
import { ActionTriggerType } from '../../_store/mask-store';

interface UseMaskToolShortcutsProps {
  handleDecreaseBrushSize: () => void;
  handleIncreaseBrushSize: () => void;
  toggleOverpainting: () => void;
  setBrush: () => void;
  setEraser: () => void;
  triggerAction: (action: ActionTriggerType) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  resetActiveTool: () => void;
  mode: string;
  editedLabel: any;
  undoRedoIndex: { current: number };
}

export const useMaskToolShortcuts = ({
  handleDecreaseBrushSize,
  handleIncreaseBrushSize,
  toggleOverpainting,
  setBrush,
  setEraser,
  triggerAction,
  handleUndo,
  handleRedo,
  resetActiveTool,
  mode,
  editedLabel,
  undoRedoIndex,
}: UseMaskToolShortcutsProps) => {
  // ESC - 초기 상태로 돌아가기 또는 도구 리셋
  useHotkeys(
    'esc',
    () => {
      const isOnInitialState = undoRedoIndex.current === (editedLabel ? 1 : 0);
      if (isOnInitialState) {
        resetActiveTool();
      } else {
        triggerAction('discard');
      }
    },
    { scopes: 'mask-tool' },
  );

  // 브러시 크기 조절
  useHotkeys(',', () => handleDecreaseBrushSize(), { scopes: 'mask-tool' });
  useHotkeys('.', () => handleIncreaseBrushSize(), { scopes: 'mask-tool' });

  // 오버페인팅 토글
  useHotkeys(['shift+o'], () => toggleOverpainting(), { scopes: 'mask-tool' });

  // 브러시/지우개 모드 전환
  useHotkeys(['b'], () => setBrush(), { scopes: 'mask-tool' });
  useHotkeys(['e'], () => (mode === 'brush' ? setEraser() : setBrush()), {
    scopes: 'mask-tool',
  });

  // 마스크 관련 액션
  useHotkeys(['shift+f'], () => triggerAction('fillClosed'), {
    scopes: 'mask-tool',
  });
  useHotkeys(['enter'], () => triggerAction('convert'), {
    scopes: 'mask-tool',
  });

  // 실행 취소/다시 실행
  useHotkeys(['mod+z', 'ctrl+z'], () => handleUndo(), {
    scopes: 'polygon-tool',
  });
  useHotkeys(['shift+mod+z', 'shift+ctrl+z'], () => handleRedo(), {
    scopes: 'polygon-tool',
  });
};
