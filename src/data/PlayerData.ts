export interface PlayerData {
  name: string;
  wins: number;
  loses: number;
  is_admin: boolean;
  // Unique.
  id: number;
  // Login code.
  code: string;
}
