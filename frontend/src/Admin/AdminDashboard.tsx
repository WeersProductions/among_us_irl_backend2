import { AdminInfo, GameSettings, GameStatus } from "common/messages";
import { useState } from "react";
import Progress from "react-progressbar";
import { EditGameSettings } from "../EditGameSettings";
import { AdminPlayerList } from "./AdminPlayerList";
import { EditGameStatus } from "./EditGameStatus";
import { MapEditor } from "./MapEditor";

interface AdminDashboardProps {
  // Game progress.
  progress: number;
  // Connection info.
  adminInfo?: AdminInfo;
  gameSettings?: GameSettings;
  // Called whenever we change a game setting.
  onEditGameSetting: (key: string, value: number) => void;
  // Called whenever a player is kicked.
  onKickPlayer: (playerId: string) => void;
  // Current gamestatus.
  gameStatus: GameStatus;
  onChangeGameStatus: (status: GameStatus) => void;
}

export const AdminDashboard = ({
  progress,
  adminInfo,
  gameSettings,
  onEditGameSetting,
  onKickPlayer,
  gameStatus,
  onChangeGameStatus,
}: AdminDashboardProps) => {
  const [editMap, setEditMap] = useState(false);
  const [editPlayers, setEditPlayers] = useState(false);

  return (
    <div>
      {editMap && <MapEditor />}
      <EditGameStatus
        gameStatus={gameStatus}
        onChangeGameStatus={onChangeGameStatus}
      />
      {gameSettings && (
        <EditGameSettings
          onValueChange={onEditGameSetting}
          gameSettings={gameSettings}
        />
      )}
      <label>
        Edit players
        <input
          name={"EditPlayers"}
          type={"checkbox"}
          checked={editPlayers}
          onChange={(event) => {
            setEditPlayers(event.target.checked);
          }}
        />
      </label>
      {adminInfo && adminInfo.connectionInfo && (
        <AdminPlayerList
          adminInfo={adminInfo}
          onKickPlayer={editPlayers ? onKickPlayer : undefined}
        />
      )}
      <Progress completed={progress * 100} style={{ marginBottom: "1rem" }} />
    </div>
  );
};
