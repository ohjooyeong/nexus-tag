import React, { createContext, useContext } from 'react';

export type CanvasDimensions = {
  originalImageWidth: number;
  originalImageHeight: number;
  imageWidth: number;
  imageHeight: number;
  containerWidth: number;
  containerHeight: number;
  absoluteScale: number;
};
export const CanvasDimensionsContext = createContext<CanvasDimensions>({
  originalImageWidth: 0,
  originalImageHeight: 0,
  imageWidth: 0,
  imageHeight: 0,
  containerWidth: 0,
  containerHeight: 0,
  absoluteScale: 0,
});

export const CanvasDimensionsContextProvider: React.FC<{
  sizes: CanvasDimensions;
  children: React.ReactNode;
}> = ({ children, sizes }) => (
  <CanvasDimensionsContext.Provider value={sizes}>
    {children}
  </CanvasDimensionsContext.Provider>
);

export const useCanvasDimensions = () => useContext(CanvasDimensionsContext);
