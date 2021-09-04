import { Socket } from "socket.io";
import { getRandom, shuffleArray } from "../arrayUtils";
import {
  default_gamesettings as defaultGameSettings,
  GameSettings,
} from "./GameSettings";
import { PlayerData, PlayerTask } from "./PlayerData";
import { Task, tasks as defaultTasks } from "./Task";

interface KickPlayerMessage {
  player_id: string;
}

enum GameStatus {
  Unknown = 0,
  NotStarted = 1,
  Playing = 2,
  Paused = 3,
  Finished = 4,
}

interface SetPlayingMessage {
  gameStatus: number;
}

interface SetGameSettingsMessage {
  settingName: string;
  settingValue: string;
}

interface FinishTaskMessage {
  taskId: string;
}

export class GameData {
  players: PlayerData[] = [];
  currentlyConnected: Map<Socket, PlayerData> = new Map();
  // Ids of imposters.
  imposters: Set<string> = new Set();
  gameStatus: GameStatus = GameStatus.Unknown;
  gameSettings: GameSettings = defaultGameSettings;
  allTasks: Task[] = defaultTasks;
  playerTasks: Map<string, PlayerTask[]> = new Map();

  public addPlayer(player: PlayerData) {
    this.players.push(player);
    this.currentlyConnected.set(player.socket, player);
    this.addHandlers(player);
  }

  private addHandlers(player: PlayerData) {
    if (player.isAdmin) {
      player.socket.on("KickPlayer", (kickPlayerMessage: KickPlayerMessage) => {
        console.log("kick-player");
        const players_with_id = this.players.filter(
          (player) =>
            player.id === kickPlayerMessage.player_id && !player.isAdmin
        );
        players_with_id.forEach((player) => {
          player.socket.disconnect();
          this.removePlayer(player);
        });
      });

      player.socket.on("SetPlaying", (setPlayingMessage: SetPlayingMessage) => {
        this.setGameStatus(setPlayingMessage.gameStatus);
      });

      player.socket.on(
        "SetGameSettings",
        (setGameSettingsMessage: SetGameSettingsMessage) => {
          // @ts-ignore
          this.gameSettings[setGameSettingsMessage.settingName] =
            setGameSettingsMessage.settingValue;
          this.sendGameSettings();
        }
      );

      player.socket.on(
        "FinishTask",
        (finishTaskMessage: FinishTaskMessage) => {
          if (this.FinishTask(player, finishTaskMessage.taskId)) {
            // The player should receive an update.
          }
        }
      );
    }
  }

  private setGameStatus(status: number) {
    if (
      this.gameStatus === GameStatus.NotStarted &&
      status === GameStatus.Playing
    ) {
      // We're starting.
      this.initializeGame();
      this.sendProgress();
    }

    this.gameStatus = status;
    this.sendGameStatus();
  }

  private initializeGame() {
    console.log("Initialize game");
    const normalPlayers = this.players.filter((player) => {
      return !player.isAdmin;
    });

    const playerIds = normalPlayers.map((player) => {
      return player.id;
    });

    const imposterIdxs: string[] = shuffleArray(playerIds).slice(
      0,
      this.gameSettings.n_imposters
    );

    const possibleTasks = this.allTasks.filter((task) => {
      return task.can_be_selected_first;
    });

    const possibleCommonTasks = possibleTasks.filter((task) => {
      return task.can_be_common;
    });

    const commonTasks = getRandom(
      possibleCommonTasks,
      this.gameSettings.n_common_tasks
    );

    this.imposters = new Set(imposterIdxs);

    const all_player_tasks = normalPlayers.map((player) => {
      const random_tasks = this.getRandomTasks(
        this.gameSettings.n_tasks - this.gameSettings.n_common_tasks,
        possibleCommonTasks,
        commonTasks.map((task) => task.id)
      );

      const player_tasks = random_tasks.concat(commonTasks).map((task) => {
        return new PlayerTask(task);
      });
      return { id: player.id, tasks: player_tasks };
    });

    this.playerTasks = new Map();
    all_player_tasks.forEach((player_task) => {
      this.playerTasks.set(player_task.id, player_task.tasks);
    });
  }

  private getClientGameInfo(client_id: string) {
    const client = this.players.find((player) => {
      return player.id === client_id;
    });

    if (!client) {
      return undefined;
    }

    const showImposters = this.imposters.has(client_id);
    const all_players = this.players.map((player) => {
      const imposter = showImposters
        ? this.imposters.has(player.id)
        : undefined;
      return {
        name: player.name,
        id: player.id,
        imposter,
      };
    });

    return {
      client: client,
      all_players,
    };
  }

  // Returns true if the client has new tasks and thus should receive an update.
  private FinishTask(player_id: string, task_id: string): boolean {
    this.players.find((player) => {
      return player.id == player_id;
    });
    return true;
  }

  private removePlayer(player: PlayerData) {
    this.currentlyConnected.delete(player.socket);
    this.sendPlayerList();
  }

  private sendPlayerList() {
    // Check whether any admin exists.
    const admins = this.players.filter((player) => {
      return player.isAdmin;
    });
    if (admins.length <= 0) {
      return;
    }

    const playerInfo = this.players
      .filter((player) => {
        return !player.isAdmin;
      })
      .map((player) => {
        const imposter = this.imposters.has(player.id);
        return { name: player.name, id: player.id, imposter };
      });

    admins.forEach((admin) => {
      admin.socket.send({
        msgType: "SetConnections",
        players: playerInfo,
      });
    });
  }

  private calculateProgress(): number {
    let total_tasks = 0;
    let finished_tasks = 0;
    this.playerTasks.forEach((player_task, player_id) => {
      if (this.imposters.has(player_id)) {
        // We skip imposters.
        return;
      }
      player_task.forEach((task) => {
        if (task.finished) {
          finished_tasks += 1;
        }
        total_tasks += 1;
      });
    });
    return total_tasks / finished_tasks;
  }

  private sendProgress() {
    const progress = this.calculateProgress();
    console.log("Curent progress: ", progress);
    this.players.forEach((player) => {
      player.socket.emit("progress", {
        progress: progress,
      });
    });
  }

  private sendGameStatus() {
    this.players.forEach((player) => {
      player.socket.emit("SetPlaying", {
        status: this.gameStatus,
        gameData: this.getClientGameInfo(player.id),
      });
    });
  }

  private sendGameSettings() {
    this.players.forEach((player) => {
      player.socket.emit("SetGameSettings", {
        gameSettings: this.gameSettings,
      });
    });
  }

  private getRandomTasks(
    n_tasks: number,
    tasks_list: Task[],
    do_not_include_ids: string[]
  ) {
    // TODO: fix this mess.
    // TODO: It should return a random subset of tasks, but exclude 'do_not_include_ids'
    let tasks_copy = shuffleArray([...tasks_list]).filter(
      (task) => !do_not_include_ids.includes(task.id)
    );
    let chosen_tasks = [];
    while (chosen_tasks.length < n_tasks && tasks_copy.length > 0) {
      chosen_tasks.push(Object.assign({}, tasks_copy.pop()));
    }
    return chosen_tasks;
  }

  public kill() {
    // TODO: kill players etc...
  }
}
