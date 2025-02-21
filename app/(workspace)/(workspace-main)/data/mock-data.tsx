// ... existing code ...

import { Dataset, Role } from '../_types';

export const mockDatasets: Dataset[] = [
  {
    id: '1',
    name: 'Training Dataset 2023',
    project: {
      id: 1,
      name: 'Object Detection',
      description: 'AI model for detecting objects in images',
      content_type: 'IMAGE',
      createdAt: '2023-12-01T00:00:00Z',
      updatedAt: '2023-12-01T00:00:00Z',
    },
    dataItems: [
      { id: 'item1', dataset: {} as Dataset },
      { id: 'item2', dataset: {} as Dataset },
      { id: 'item3', dataset: {} as Dataset },
    ],
    createdBy: {
      id: 1,
      user: {
        id: 'user1',
        username: 'John Doe',
        email: 'john@example.com',
        birthdate: null,
      },
      workspaceId: 'workspace1',
      role: Role.MANAGER,
      createdAt: '2023-12-01T00:00:00Z',
      updatedAt: '2023-12-01T00:00:00Z',
    },
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2023-12-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Validation Dataset',
    project: {
      id: 2,
      name: 'Image Classification',
      description: 'Image classification project',
      content_type: 'IMAGE',
      createdAt: '2023-12-01T00:00:00Z',
      updatedAt: '2023-12-01T00:00:00Z',
    },
    dataItems: [
      { id: 'item4', dataset: {} as Dataset },
      { id: 'item5', dataset: {} as Dataset },
    ],
    createdBy: {
      id: 2,
      user: {
        id: 'user2',
        username: 'Jane Smith',
        email: 'jane@example.com',
        birthdate: null,
      },
      workspaceId: 'workspace1',
      role: Role.WORKER,
      createdAt: '2023-12-01T00:00:00Z',
      updatedAt: '2023-12-01T00:00:00Z',
    },
    createdAt: '2023-12-02T00:00:00Z',
    updatedAt: '2023-12-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Test Dataset',
    project: {
      id: 3,
      name: 'Video Analysis',
      description: 'Video analysis project',
      content_type: 'VIDEO',
      createdAt: '2023-12-01T00:00:00Z',
      updatedAt: '2023-12-01T00:00:00Z',
    },
    dataItems: [
      { id: 'item6', dataset: {} as Dataset },
      { id: 'item7', dataset: {} as Dataset },
      { id: 'item8', dataset: {} as Dataset },
      { id: 'item9', dataset: {} as Dataset },
    ],
    createdBy: {
      id: 3,
      user: {
        id: 'user3',
        username: 'Mike Johnson',
        email: 'mike@example.com',
        birthdate: null,
      },
      workspaceId: 'workspace1',
      role: Role.REVIEWER,
      createdAt: '2023-12-01T00:00:00Z',
      updatedAt: '2023-12-01T00:00:00Z',
    },
    createdAt: '2023-12-03T00:00:00Z',
    updatedAt: '2023-12-03T00:00:00Z',
  },
];
