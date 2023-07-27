import { useEffect, useState } from "react";
import { MiniGame } from "./MiniGame";
import { TaskScanner } from "./TaskScanner";
import Progress from "react-progressbar";
import { GameStatus } from "./GameStatusEnum";
import { AmongUsMap } from "./AmongUsMap";
import { Socket } from "socket.io-client";

interface AmongUsProperties {
  gameStatus: GameStatus;
  gameData: GameData | null;
  socket: Socket;
  progress: number;
  bodyReporter: string | null;
}

export interface PlayerTask {
  id: string;
  finished: boolean;
  location: number;
  task_name: string;
}

export interface Player {
  id: number;
  imposter?: boolean;
  name: string;
}

export interface CurrentPlayer extends Player {
  tasks: PlayerTask[];
}

export interface GameData {
  allPlayers: Player[];
  client: CurrentPlayer;
}

export const AmongUs = ({
  gameStatus,
  gameData,
  socket,
  bodyReporter,
  progress,
}: AmongUsProperties) => {
  const [roleTime, setRoleTime] = useState(5);
  const [currentTask, setCurrentTask] = useState<PlayerTask | null>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const listener = () => {
      if (showMap) {
        setShowMap(false);
      }
    };

    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [showMap]);

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

  if (gameStatus === GameStatus.Paused) {
    return (
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
    );
  }

  if (gameStatus === GameStatus.Finished) {
    return (
      <div>
        <p>{progress >= 1 ? "Non-Imposters won!" : "Imposters won!"}</p>
      </div>
    );
  }

  return (
    <>
      <h1 style={{ fontSize: 32 }}>Among Us</h1>
      <Progress completed={progress * 100} style={{ marginBottom: "1rem" }} />
      {bodyReporter && <h1>Body Reported By: {bodyReporter}</h1>}
      {roleTime > 0 ? (
        <p>
          You're{" "}
          {gameData?.client.imposter
            ? `imposter with ${gameData?.allPlayers
                .filter((player) => player.imposter)
                .map((player) => player.name)
                .join(", ")}`
            : "normal"}
        </p>
      ) : (
        <>
          {showMap && (
            <div
              style={{
                position: "absolute",
                zIndex: 10,
                left: 0,
                right: 0,
                marginTop: -150,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  width: "80%",
                  background: "rgb(60 33 17)",
                  boxShadow: "inset 0 3px 8px rgba(0, 0, 0, 0.3)",
                  borderRadius: "4px",
                }}
              >
                <AmongUsMap tasks={gameData?.client.tasks} />
              </div>
            </div>
          )}
          {currentTask ? (
            <MiniGame
              task={currentTask}
              onFinish={() => {
                socket.emit("FinishTask", { taskId: currentTask.id });
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
              disabled={bodyReporter !== null}
              onClick={() => socket.emit("ReportBody")}
            >
              Report
            </button>
          </div>
        </>
      )}
    </>
  );
};
