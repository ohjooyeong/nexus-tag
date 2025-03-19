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

export type Content_Type = 'IMAGE' | 'VIDEO';

export interface Project {
  id: number;
  name: string;
  description: string;
  content_type: Content_Type;
  totalImages: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
}
export interface Dataset {
  id: string;
  name: string;
  project: Project;
  dataItems?: DataItem[];
  createdBy: WorkspaceMember;
  createdAt: string;
  updatedAt: string;
}

export enum Status {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  TO_REVIEW = 'TO_REVIEW',
  DONE = 'DONE',
  SKIPPED = 'SKIPPED',
  COMPLETED = 'COMPLETED',
}

export interface DataItem {
  id: string;
  name: string;
  fileUrl: string;
  originalName: string;
  filename: string;
  path: string;
  mimeType: string;
  size: number;
  status: Status;
  dataset: Dataset;
  createdAt: string;
  updatedAt: string;
}
