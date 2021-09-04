import { GameProps } from "../MiniGame";
import {
  Box,
  ClearBoxes,
  CreateBox,
  DestroyBox,
  MoveBoxes,
  RotateBox,
} from "./GameClearAsteroidsEntities";
import { GameEngine } from "react-game-engine";
import { useEffect, useState } from "react";

const AsteroidsToDestroy = 10;

export const GameClearAsteroids = ({ onFinish }: GameProps) => {
  const [destroyed, setDestroyed] = useState(0);

  useEffect(() => {
    if (destroyed >= AsteroidsToDestroy) {
      onFinish();
    }
    return () => {};
  }, [destroyed, onFinish]);

  return (
    <>
      <p>
        Clear asteroids {destroyed}/{AsteroidsToDestroy}
      </p>
      <GameEngine
        style={{
          width: "100vw",
          height: "50vh",
          backgroundColor: "blue",
          overflow: "hidden",
        }}
        systems={[
          MoveBoxes,
          DestroyBox(() => {
            setDestroyed(destroyed + 1);
          }),
          CreateBox,
          ClearBoxes,
          RotateBox,
        ]}
        entities={{}}
      />
    </>
  );
};
