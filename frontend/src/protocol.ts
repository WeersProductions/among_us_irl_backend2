import { GameData, PlayerTask } from "./AmongUs";
import { GameSettings } from "./GameSettings";
import { GameStatus } from "./GameStatusEnum";

export enum LoginCodeStatus {
  UserEntering,
  AwaitingResponse,
  Success,
}

export interface LoginResponse {
  id: string;
  status: LoginCodeStatus;
  profile: {
    name: string;
    wins: number;
    loses: number;
    isAdmin: boolean;
  };
  game: {
    settings: GameSettings;
    status: GameStatus;
  };
}

export interface SetGameSettingsMessage {
  gameSettings: GameSettings;
}

export interface SetPlayingMessage {
  status: GameStatus;
  gameData: GameData;
}

export interface SetProgressMessage {
  progress: number;
}

export interface SetTasksMessage {
  tasks: PlayerTask[];
}

export interface CurrentConnection {
  name: string;
  id: string;
  imposter?: boolean;
}

export interface SetConnectionsMessage {
  totalConnectionCount: number;
  loggedInConnections: CurrentConnection[];
}

export interface AdminInfo {
  connectionInfo: {
    totalConnectionCount: number;
    loggedInConnections: CurrentConnection[];
  };
}
