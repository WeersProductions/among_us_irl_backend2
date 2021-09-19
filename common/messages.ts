export interface PlayerTask {
  id: string;
  finished: boolean;
  location: number;
}

export interface GameSettings {
  n_imposters: number;
  n_tasks: number;
  n_common_tasks: number;
}

export enum LoginCodeStatus {
  UserEntering,
  AwaitingResponse,
  Success,
}

export interface Player {
  id: number;
  imposter?: boolean;
  name: string;
}

export interface CurrentPlayer extends Player {
  tasks: PlayerTask[];
}

export interface GameData {
  allPlayers: Player[];
  client: CurrentPlayer;
}

export enum GameStatus {
  Unknown = 0,
  NotStarted = 1,
  Playing = 2,
  Paused = 3,
  Finished = 4,
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
}

export interface SetGameSettingsMessage {
  gameSettings: GameSettings;
}

export interface ChangeGameSettingsMessage {
  settingName: string;
  settingValue: string | number;
}

export interface KickPlayerMessage {
  playerId: string;
}

export interface SetPlayingMessage {
  gameStatus: GameStatus;
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

export interface FinishTaskMessage {
  taskId: string;
}
