import React, { createContext, useContext, useMemo } from 'react';

export const RequestParamsContext = createContext<{
  projectId: string;
  imageId: string;
}>({
  projectId: '',
  imageId: '',
});

export const RequestParamsContextProvider: React.FC<{
  projectId: string;
  imageId: string;
  children: React.ReactNode;
}> = ({ children, projectId, imageId }) => {
  const value = useMemo(() => ({ projectId, imageId }), [imageId, projectId]);

  return (
    <RequestParamsContext.Provider value={value}>
      {children}
    </RequestParamsContext.Provider>
  );
};

export const useImageViewRequestParams = () => useContext(RequestParamsContext);
