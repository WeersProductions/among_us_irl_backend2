import { Socket } from "socket.io";
import { Task } from "./Task";

export class PlayerData {
  wins: number = 0;
  loses: number = 0;
  isAdmin = false;

  constructor(public name: string, public id: string, public socket: Socket) {
    console.log(`Created new user: ${name}`);

    if (name === "FloJo" || name === "Flippo") {
      this.isAdmin = true;
    }
  }

  public initialize() {
    this.socket.on("kikker", () => {});
  }
}

export class PlayerTask {
  public finished: boolean = false;

  constructor(public task: Task) {}
}

export class PlayerClientTask {
  constructor(public finished: boolean, public task_id: string) {}

  public serialize() {
    return {
      finished: this.finished,
      task_id: this.task_id,
    };
  }
}
