export interface Customer {
  id: string;
  lineUserId: string;
  displayName: string;
  pictureUrl: string | null;
  nickname: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}
