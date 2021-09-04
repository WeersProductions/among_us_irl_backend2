import { useEffect, useState } from "react";
import { MiniGame } from "./MiniGame";
import { TaskScanner } from "./TaskScanner";
import Progress from "react-progressbar";
import { GameStatus } from "./GameStatusEnum";
import { AmongUsMap } from "./AmongUsMap";
import { Socket } from "socket.io-client";

interface BasicMessage {
  msgType: string;
  code: string;
}

interface AmongUsProperties {
  gameStatus: GameStatus;
  gameData: GameData | null;
  socket: Socket;
  getBasicMessage: (msgType: string) => BasicMessage;
  progress: number;
}

export interface Task {
  long: boolean;
  name: string;
  id: string;
  can_be_common: boolean;
  location: number;
  finished?: boolean;
}

export interface Player {
  id: number;
  imposter?: boolean;
  name: string;
  tasks: Task[];
}

export interface GameData {
  allPlayers: Player[];
  client: Player;
}

const SendFinishTask = (
  basicMessage: BasicMessage,
  taskId: string,
  socket: Socket
) => {
  //TODO: refactor
  socket.send(
    JSON.stringify({
      ...basicMessage,
      taskId,
    })
  );
};

export const AmongUs = ({
  gameStatus,
  gameData,
  socket,
  getBasicMessage,
  progress,
}: AmongUsProperties) => {
  const [roleTime, setRoleTime] = useState(5);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(updateRoleTime, 1000);
    function updateRoleTime() {
      setRoleTime((rT) => {
        if (rT < 0) {
          clearInterval(intervalId);
        }
        return rT - 1;
      });
    }
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      {gameStatus === GameStatus.Paused && (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            background: "rbga(82, 89, 102, 80)",
          }}
        >
          <p style={{ margin: "auto" }}>Game paused...</p>
        </div>
      )}
      {gameStatus === GameStatus.Finished ? (
        <div>
          <p>{progress >= 1 ? "Non-Imposters won!" : "Imposters won!"}</p>
        </div>
      ) : (
        <>
          <p>Among us</p>
          <Progress
            completed={progress * 100}
            style={{ marginBottom: "1rem" }}
          />
          {roleTime > 0 ? (
            <p>
              You're{" "}
              {gameData?.client.imposter
                ? `imposter with ${gameData?.allPlayers
                    .filter((player) => player.imposter)
                    .map((player) => `${player.name}, `)}`
                : "normal"}
            </p>
          ) : (
            <>
              {showMap && (
                <div
                  style={{
                    position: "absolute",
                    width: "90vw",
                    zIndex: 10,
                    background: "gray",
                    left: 0,
                    padding: "1rem",
                  }}
                >
                  <button
                    style={{
                      margin: "1rem",
                      padding: "0.5rem",
                      paddingRight: "1rem",
                      paddingLeft: "1rem",
                      borderRadius: "1rem",
                      background: "white",
                    }}
                    onClick={() => setShowMap(!showMap)}
                  >
                    Close
                  </button>
                  <AmongUsMap
                    taskLocations={gameData?.client.tasks
                      .filter((task) => !task.finished)
                      .map((task) => task.location)}
                  />
                </div>
              )}
              {currentTask ? (
                <MiniGame
                  task={currentTask}
                  onFinish={() => {
                    SendFinishTask(
                      getBasicMessage("FinishTask"),
                      currentTask.id,
                      socket
                    );
                    currentTask.finished = true;
                    setCurrentTask(null);
                  }}
                />
              ) : (
                <TaskScanner
                  onScanSuccess={(task_id) => {
                    const foundTask = gameData?.client.tasks
                      .filter((task) => !task.finished)
                      .find((task) => task.id === task_id);
                    setCurrentTask(foundTask ? foundTask : null);
                  }}
                />
              )}
              <div>
                <button
                  style={{
                    margin: "1rem",
                    padding: "0.5rem",
                    paddingRight: "1rem",
                    paddingLeft: "1rem",
                    borderRadius: "1rem",
                    background: "white",
                  }}
                  onClick={() => setShowMap(!showMap)}
                >
                  Map
                </button>
                <button
                  style={{
                    margin: "1rem",
                    padding: "0.5rem",
                    paddingRight: "1rem",
                    paddingLeft: "1rem",
                    borderRadius: "1rem",
                    background: "white",
                  }}
                  onClick={() =>
                    socket.send(JSON.stringify({ msgType: "ReportBody" }))
                  }
                >
                  Report
                </button>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};
