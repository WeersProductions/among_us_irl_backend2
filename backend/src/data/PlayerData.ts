import { Socket } from "socket.io";
import { PlayerTask as PlayerTaskMessage } from "common/messages";
import { BackendReceiveProtocol, BackendSendProtocol } from "common/protocol";
import { Task } from "./Task";

export class PlayerData {
  wins: number = 0;
  loses: number = 0;
  isAdmin = false;

  constructor(
    public name: string,
    public id: string,
    public socket: Socket<BackendReceiveProtocol, BackendSendProtocol>
  ) {
    console.log(`Created new user: ${name}`);

    if (name === "FloJo" || name === "Flippo") {
      this.isAdmin = true;
    }
  }

  public initialize() {}
}

export class PlayerTask {
  public finished: boolean = false;

  constructor(public task: Task, public location: number) {}
}

export class PlayerClientTask {
  constructor(
    public finished: boolean,
    public task_id: string,
    public location: number
  ) {}

  public serialize(): PlayerTaskMessage {
    return {
      finished: this.finished,
      id: this.task_id,
      location: this.location,
    };
  }
}
