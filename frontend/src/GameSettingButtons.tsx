import React from "react";
import { AdminInfo } from "./protocol";
import { GameStatus } from "./GameStatusEnum";
import Progress from "react-progressbar";
import { GameSettings } from "./GameSettings";
import { EditGameSettings } from "./EditGameSettings";

interface GameSettingButtonsProps {
  gameStatus: GameStatus;
  onChangeGameStatus: (status: GameStatus) => void;
  onKickPlayer: (playerId: string) => void;
  onEditGameSetting: (key: string, value: number) => void;
  adminInfo: AdminInfo | null;
  progress: number;
  gameSettings: GameSettings | null;
}

const StatusMap = [
  { text: "Unknown", newState: GameStatus.Unknown },
  { text: "Start", newState: GameStatus.Playing },
  { text: "Pause", newState: GameStatus.Paused },
  { text: "Continue", newState: GameStatus.Playing },
  { text: "Replay", newState: GameStatus.NotStarted },
];

const getButtonText = (status: GameStatus) => {
  return StatusMap[status.valueOf()].text;
};

const getNewState = (status: GameStatus) => {
  return StatusMap[status.valueOf()].newState;
};

export const GameSettingButtons = ({
  gameStatus,
  onChangeGameStatus,
  adminInfo,
  progress,
  onKickPlayer,
  gameSettings,
  onEditGameSetting,
}: GameSettingButtonsProps) => {
  return (
    <div>
      <p>Game settings</p>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button
          style={{ padding: "1rem" }}
          type="button"
          onClick={() => onChangeGameStatus(getNewState(gameStatus))}
        >
          {getButtonText(gameStatus)}
        </button>

        <button
          style={{ marginTop: "2rem", background: "red", padding: "0.5rem" }}
          type="button"
          onClick={() => onChangeGameStatus(GameStatus.NotStarted)}
        >
          Stop
        </button>
      </div>
      {gameSettings && (
        <EditGameSettings
          onValueChange={onEditGameSetting}
          gameSettings={gameSettings}
        />
      )}
      {adminInfo && adminInfo.connectionInfo && (
        <div>
          <p>
            Total connections: {adminInfo.connectionInfo.totalConnectionCount}
          </p>
          <div style={{ maxHeight: "40vh", overflow: "scroll" }}>
            {adminInfo.connectionInfo.loggedInConnections.map((connection) => {
              return (
                <div
                  key={connection.id}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <p>
                    {connection.id} - {connection.name}{" "}
                    {connection.imposter !== undefined &&
                      (connection.imposter ? "🥵" : "😇")}
                  </p>
                  <button
                    style={{ background: "red", marginLeft: "1rem" }}
                    onClick={() => onKickPlayer(connection.id)}
                  >
                    Kick
                  </button>
                </div>
              );
            })}
          </div>
          <Progress
            completed={progress * 100}
            style={{ marginBottom: "1rem" }}
          />
        </div>
      )}
    </div>
  );
};
