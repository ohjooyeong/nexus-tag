// 워크스페이스 개별 객체 타입
export interface Workspace {
  id: string; // 고유 ID (UUID)
  name: string; // 워크스페이스 이름
  description: string; // 설명
  plan: 'FREE' | 'ADVANCED' | 'ENTERPRISE';
  createdAt: string;
  updatedAt: string;
}

// 워크스페이스 목록 타입
export type WorkspaceList = Workspace[];
