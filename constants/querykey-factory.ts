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
};

export const userQueries = {
  default: () => ['user'],
  profile: () => [...userQueries.default(), 'profile'],
  // ... other user related queries
} as const;

export const memberQueries = {
  default: () => ['members'],
  list: (id: string) => [...memberQueries.default(), 'list', id],
};
