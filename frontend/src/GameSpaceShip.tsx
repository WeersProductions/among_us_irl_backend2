import { GameProps } from "./MiniGame";

export const GameSpaceShip = ({ onFinish }: GameProps) => {
  return (
    <>
      <p>space ship</p>
      <button onClick={onFinish}>Finish!</button>
    </>
  );
};
