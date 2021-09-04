import { Socket } from "socket.io";
import { v4 } from "uuid";
import { isPermanentDisconnect } from "../utils";
import { GameData, GameStatus } from "./GameData";
import { PlayerData } from "./PlayerData";

export class GameManager {
  private currentGame = new GameData();
  private players: PlayerData[] = [];

  public addPlayer(name: string, socket: Socket): PlayerData {
    let player = this.players.find((p) => p.name === name);

    if (!player) {
      player = new PlayerData(name, v4(), socket);
      this.players.push(player);
    }

    const { id } = player;
    player.socket.on("disconnect", (reason) => {
      if (isPermanentDisconnect(reason)) {
        this.players = this.players.filter((p) => p.id !== id);
      }
    });

    if (this.currentGame.gameStatus === GameStatus.NotStarted) {
      this.currentGame.addPlayer(player);
    }

    const playerInGame = this.currentGame.players.find((p) => p.name === name);
    if (playerInGame) {
      playerInGame.socket = socket;
      this.currentGame.addPlayer(player);
    }

    return player;
  }

  public startNewGame() {
    this.currentGame.kill();

    this.currentGame = new GameData();
    this.players.forEach((player) => {
      this.currentGame.addPlayer(player);
    });
  }

  public getCurrentGame(): GameData {
    return this.currentGame;
  }
}
