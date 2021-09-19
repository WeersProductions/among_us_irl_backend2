import { AdminInfo } from "common/messages";

interface AdminPlayerListProps {
  adminInfo: AdminInfo;
  onKickPlayer?: (playerId: string) => void;
}

export const AdminPlayerList = ({
  adminInfo,
  onKickPlayer,
}: AdminPlayerListProps) => {
  return (
    <div>
      <p>Total connections: {adminInfo.connectionInfo.totalConnectionCount}</p>
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
              {onKickPlayer && (
                <button
                  style={{ background: "red", marginLeft: "1rem" }}
                  onClick={() => onKickPlayer(connection.id)}
                >
                  Kick
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
