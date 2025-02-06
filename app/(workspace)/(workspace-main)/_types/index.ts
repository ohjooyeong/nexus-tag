export enum Role {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  REVIEWER = 'REVIEWER',
  WORKER = 'WORKER',
  VIEWER = 'VIEWER',
}

export interface WorkspaceMember {
  id: number;
  user: {
    id: string;
    username: string;
    email: string;
    birthdate: Date | null;
  };
  workspaceId: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

// 워크스페이스 개별 객체 타입
export interface Workspace {
  id: string;
  name: string;
  description: string;
  plan: 'FREE' | 'ADVANCED' | 'ENTERPRISE';
  ownerId: string;
  members: WorkspaceMember[];
  createdAt: string;
  updatedAt: string;
}

// 워크스페이스 목록 타입
export type WorkspaceList = Workspace[];
