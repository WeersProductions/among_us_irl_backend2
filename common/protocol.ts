import {
  ChangeGameSettingsMessage,
  FinishTaskMessage,
  KickPlayerMessage,
  SetConnectionsMessage,
  SetPlayingMessage,
  SetProgressMessage,
  SetTasksMessage,
} from "./messages";

export interface BackendReceiveProtocol {
  SetPlaying: (msg: SetPlayingMessage) => void;
  ReportBody: () => void;
  KickPlayer: (msg: KickPlayerMessage) => void;
  ChangeGameSettings: (msg: ChangeGameSettingsMessage) => void;
  FinishTask: (msg: FinishTaskMessage) => void;
}

export interface BackendSendProtocol {
  SetConnections: (msg: SetConnectionsMessage) => void;
  Progress: (msg: SetProgressMessage) => void;
  SetPlaying: (msg: SetPlayingMessage) => void;
  SetTasks: (msg: SetTasksMessage) => void;
  BodyReported: () => void;
}
