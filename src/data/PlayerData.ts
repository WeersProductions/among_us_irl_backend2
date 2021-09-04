import { Socket } from "socket.io";
import { Task } from "./Task";

export class PlayerData {
  wins: number = 0;
  loses: number = 0;
  isAdmin = false;

  constructor(public name: string, public id: string, public socket: Socket) {
    console.log(`Created new user: ${name}`);
  }

  public set_admin() {
    this.isAdmin = true;
  }

  public initialize() {
    this.socket.on("kikker", () => {});
  }
}

export class PlayerTask {
  public finished: boolean = false;

  constructor(public task: Task) {}
}
