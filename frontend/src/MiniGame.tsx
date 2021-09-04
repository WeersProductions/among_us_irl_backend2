import { Task } from "./AmongUs";
import { GameElectricWires } from "./GameElectricWires";
import { GameSpaceShip } from "./GameSpaceShip";
import { GameFuelTank } from "./Games/GameFuelTank";
import { GameClearAsteroids } from "./Games/GameClearAsteroids";
import { GameRecordTemperature } from "./Games/GameRecordTemperature";
import { GameSwipeCard } from "./Games/GameSwipeCard";
import { GameBeerPong } from "./Games/GameBeerPong";

export interface MiniGameProps {
  task: Task;
  onFinish: () => void;
}

export interface GameProps {
  onFinish: () => void;
}

export const MiniGame = ({ task, onFinish }: MiniGameProps) => {
  switch (task.id) {
    case "another_task":
    case "electric_wires":
      return <GameElectricWires onFinish={onFinish} />;
    case "space_ship":
      return <GameSpaceShip onFinish={onFinish} />;
    case "fuel_tank":
      return <GameFuelTank onFinish={onFinish} />;
    case "clear_asteroids":
      return <GameClearAsteroids onFinish={onFinish} />;
    case "record_temperature":
      return <GameRecordTemperature onFinish={onFinish} />;
    case "swipe_card":
      return <GameSwipeCard onFinish={onFinish} />;
    case "beer_pong":
      return <GameBeerPong onFinish={onFinish} />;
    default:
      return <p>Unknown game: {task.id}</p>;
  }
};
