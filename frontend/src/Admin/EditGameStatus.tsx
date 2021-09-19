import { GameStatus } from "../GameStatusEnum";

// TODO: move these to common?
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
// TODO: till here?

interface GameStatusProps {
  gameStatus: GameStatus;
  onChangeGameStatus: (status: GameStatus) => void;
}

export const EditGameStatus = ({
  gameStatus,
  onChangeGameStatus,
}: GameStatusProps) => {
  return (
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
  );
};
