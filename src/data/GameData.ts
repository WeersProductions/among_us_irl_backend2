import { PlayerData } from "./PlayerData";

export interface GameData {
  players: PlayerData[];
  currentlyConnected: WebSocket;
}
