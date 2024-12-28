import React, { createContext, useContext } from 'react';
import { Stage } from 'konva/lib/Stage';

export const KonvaStageContext = createContext<Stage>({} as Stage);

export const KonvaStageContextProvider: React.FC<{
  stage: Stage;
  children: React.ReactNode;
}> = ({ children, stage }) => (
  <KonvaStageContext.Provider value={stage}>
    {children}
  </KonvaStageContext.Provider>
);

export const useKonvaStage = () => useContext(KonvaStageContext);
