import { GameData } from "./AmongUs";
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
