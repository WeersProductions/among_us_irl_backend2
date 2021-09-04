import { GameData } from "./GameData";

export class GameManager {
  private currentGame = new GameData();

  startNewGame() {
    this.currentGame.kill();

    this.currentGame = new GameData();
  }

  public getCurrentGame(): GameData {
    return this.currentGame;
  }
}
