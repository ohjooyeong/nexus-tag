export const workspaceQueries = {
  default: () => ['workspace'],
  detail: (id: string) => [...workspaceQueries.default(), id],
  list: () => [...workspaceQueries.default(), 'list'],
};
