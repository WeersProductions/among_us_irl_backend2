import { Socket } from "socket.io";
import { v4 } from "uuid";
import { getRandom, shuffleArray } from "../arrayUtils";
import { isPermanentDisconnect } from "../utils";
import { defaultGameSettings, GameSettings } from "./GameSettings";
import { DEFAULT_MAP, MapInfo } from "./MapInfo";
import { PlayerClientTask, PlayerData, PlayerTask } from "./PlayerData";
import { Task, tasks as defaultTasks } from "./Task";

interface KickPlayerMessage {
  playerId: string;
}

export enum GameStatus {
  Unknown = 0,
  NotStarted = 1,
  Playing = 2,
  Paused = 3,
  Finished = 4,
}

export interface SetPlayingMessage {
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
  gameStatus: GameStatus = GameStatus.NotStarted;
  gameSettings: GameSettings = defaultGameSettings;
  allTasks: Task[] = defaultTasks;
  playerTasks: Map<string, PlayerTask[]> = new Map();
  mapInfo: MapInfo = DEFAULT_MAP;

  public addPlayer(player: PlayerData) {
    const existingPlayer = this.players.find((p) => p.name === player.name);
    if (!existingPlayer) {
      this.players.push(player);
    }
    this.currentlyConnected.set(player.socket, player);
    this.addHandlers(player);

    this.sendGameStatus();
    this.sendGameSettings();

    this.sendPlayerList();

    return player;
  }

  private addHandlers(player: PlayerData) {
    player.socket.on("FinishTask", (finishTaskMessage: FinishTaskMessage) => {
      this.FinishTask(player, finishTaskMessage.taskId);
      // The player should receive an update.
      this.sendTasks(player);
      this.sendProgress();
    });

    player.socket.on("disconnect", (reason) => {
      if (isPermanentDisconnect(reason)) {
        this.currentlyConnected.delete(player.socket);
        this.sendPlayerList();
      }
    });

    player.socket.on("ReportBody", () => {
      this.sendBodyReported(player.name);
    });

    if (player.isAdmin) {
      player.socket.on("KickPlayer", (kickPlayerMessage: KickPlayerMessage) => {
        console.log("kick-player");
        const playersWithId = this.players.filter(
          (player) =>
            player.id === kickPlayerMessage.playerId && !player.isAdmin
        );
        playersWithId.forEach((player) => {
          player.socket.disconnect();
          this.removePlayer(player);
        });
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
    }
  }

  public setGameStatus(status: number) {
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
    console.log(this.players);
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

    // Give locations to these tasks.
    // this.mapInfo.usedLocations = {};
    // const commonLocations = getRandom(
    //   Object.values(this.mapInfo.qrLocations),
    //   commonTasks.length
    // );
    // commonTasks.forEach((task, index) => {
    //   // Dibs a location.
    //   const location = commonLocations[index];
    //   this.mapInfo.usedLocations[task.id] = location;
    // });

    this.imposters = new Set(imposterIdxs);

    const all_player_tasks = normalPlayers.map((player) => {
      const random_tasks = this.getRandomTasks(
        this.gameSettings.n_tasks - this.gameSettings.n_common_tasks,
        possibleCommonTasks,
        commonTasks.map((task) => task.id)
      );

      const player_tasks = random_tasks.concat(commonTasks).map((task) => {
        // Check if we already have a location for this task.
        // let location = this.mapInfo.usedLocations[task.id];
        console.log({ taskid: task.id, locs: this.mapInfo.qrLocations });
        let location = this.mapInfo.qrLocations[task.id];
        // if (!location) {
        //   // Dibs a new one!
        //   // Exclude the used ones.
        //   // TODO: check of deze meuk werkt.
        //   const possible = Array.from(
        //     new Set(
        //       [...Object.values(this.mapInfo.qrLocations)].filter(
        //         (x) =>
        //           !new Set(Object.values(this.mapInfo.usedLocations)).has(x)
        //       )
        //     )
        //   );
        //   location = getRandom(possible, 1)[0];
        // }
        this.mapInfo.usedLocations[task.id] = location;
        return new PlayerTask(task, location);
      });
      return { id: player.id, tasks: player_tasks };
    });

    console.log(this.mapInfo);

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
    const allPlayers = this.players.map((player) => {
      const imposter = showImposters
        ? this.imposters.has(player.id)
        : undefined;
      return {
        name: player.name,
        id: player.id,
        imposter,
      };
    });

    const playerTasks = this.playerTasks.get(client.id)?.map((task) => {
      return {
        finished: task.finished,
        location: task.location,
        id: task.task.id,
        task_name: task.task.name,
      };
    });

    return {
      allPlayers,
      client: {
        name: client.name,
        imposter: this.imposters.has(client.id),
        id: client.id,
        tasks: playerTasks,
      },
    };
  }

  // Returns true if the client has new tasks
  private FinishTask(player: PlayerData, task_id: string): boolean {
    const finished_task = this.playerTasks
      .get(player.id)
      ?.find((playerTask) => {
        return playerTask.task.id === task_id;
      });
    if (!finished_task) {
      return false;
    }
    finished_task.finished = true;
    if (finished_task.task.next_phase_id) {
      const newTask = this.allTasks.find((task) => {
        return task.id === finished_task.task.next_phase_id;
      });
      if (!newTask) {
        return false;
      }

      const all_player_tasks = this.playerTasks.get(player.id);
      all_player_tasks
        ?.filter((playerTask) => {
          return playerTask.task.id !== task_id;
        })
        .push(new PlayerTask(newTask, 0)); // TODO: location
    }
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
      admin.socket.emit("SetConnections", {
        totalConnectionCount: this.currentlyConnected.size,
        loggedInConnections: playerInfo,
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
    if (total_tasks <= 0) {
      return 0;
    }
    return finished_tasks / total_tasks;
  }

  private sendProgress() {
    const progress = this.calculateProgress();
    console.log("Curent progress: ", progress);
    if (progress >= 1) {
      // We're done!
      this.gameStatus = GameStatus.Finished;
      this.sendGameStatus();
    }
    this.players.forEach((player) => {
      player.socket.emit("Progress", {
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

  private sendBodyReported(from: string) {
    this.players.forEach((player) => {
      player.socket.emit("BodyReported", { reporter: from });
    });
  }

  private sendTasks(player: PlayerData) {
    const player_tasks = this.playerTasks.get(player.id);
    console.log(player_tasks);
    player.socket.emit("SetTasks", {
      tasks: player_tasks?.map((task) =>
        new PlayerClientTask(
          task.finished,
          task.task.id,
          task.location,
          task.task.name
        ).serialize()
      ),
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

    this.players = [];
    this.currentlyConnected.clear();
  }
}
