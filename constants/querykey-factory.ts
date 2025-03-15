export const workspaceQueries = {
  default: () => ['workspaces'],
  detail: (id: string) => [...workspaceQueries.default(), id],
  list: (id: string) => [...workspaceQueries.default(), 'list', id],
  myRole: (id: string) => [...workspaceQueries.default(), 'myRole', id],
};

export const projectQueries = {
  default: () => ['projects'],
  list: (
    workspaceId: string,
    search?: string,
    page: number = 1,
    limit: number = 20,
    order: 'asc' | 'desc' = 'desc',
  ) => [...projectQueries.default(), workspaceId, search, page, limit, order],
  detail: (id: string) => [...projectQueries.default(), id],
};

export const userQueries = {
  default: () => ['user'],
  profile: () => [...userQueries.default(), 'profile'],
} as const;

export const memberQueries = {
  default: () => ['members'],
  list: (id: string) => [...memberQueries.default(), 'list', id],
};

export const datasetQueries = {
  default: () => ['datasets'],
  item: (
    projectId: string,
    datasetId: string,
    page: number = 1,
    limit: number = 20,
    order: 'asc' | 'desc' = 'desc',
  ) => [...datasetQueries.default(), projectId, datasetId, page, limit, order],
  detail: (id: string) => [...datasetQueries.default(), id],
  list: (id: string) => [...datasetQueries.default(), 'list', id],
  stats: (id: string) => [...datasetQueries.default(), id, 'stats'],
};

export const dataItemQueries = {
  default: () => ['dataItems'],
  detail: (id: string) => [...dataItemQueries.default(), id],
};

export const classLabelQueries = {
  default: () => ['classLabels'],
  list: (id: string) => [...classLabelQueries.default(), 'list', id],
};

export const labelsQueries = {
  default: () => ['labels'],
  list: (id: string) => [...labelsQueries.default(), 'list', id],
};

export const dashboardQueries = {
  default: () => ['dashboard'],
  overview: (id: string) => [...dashboardQueries.default(), 'overview', id],
  info: (id: string) => [...dashboardQueries.default(), 'info', id],
};
