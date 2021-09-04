import { Socket } from "socket.io-client";

interface WebsocketStatusInfoProps {
  websocket: Socket;
}

const GetStatusText = (websocket: Socket) => {
  if (websocket.connected) {
    return null;
  }

  if (websocket.disconnected && websocket.active) {
    return "Connecting...";
  }

  if (websocket.disconnected) {
    return "Lost connection";
  }

  return null;
};

export const WebsocketStatusInfo = ({
  websocket,
}: WebsocketStatusInfoProps) => {
  const statusText = GetStatusText(websocket);
  return <p style={{ color: "red" }}>{statusText}</p>;
};
