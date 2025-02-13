export const workspaceQueries = {
  default: () => ['workspaces'],
  detail: (id: string) => [...workspaceQueries.default(), id],
  list: () => [...workspaceQueries.default(), 'list'],
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
