import { GameSettings } from "./GameSettings";

interface EditGameSettingsProps {
  gameSettings: GameSettings;
  onValueChange: (key: string, value: number) => void;
}

export const EditGameSettings = ({
  gameSettings,
  onValueChange,
}: EditGameSettingsProps) => {
  const changeValue = (key: string, value: number) => {
    if (value === undefined || value === null || isNaN(value)) {
      value = 0;
    }
    onValueChange(key, value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "1rem",
        gap: "0.5rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <label htmlFor="#imposters"># Imposters: </label>
        <input
          type="number"
          id="#imposters"
          min={1}
          value={gameSettings.n_imposters}
          onChange={(event) =>
            changeValue("n_imposters", event.target.valueAsNumber)
          }
        ></input>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <label htmlFor="#tasks"># Tasks: </label>
        <input
          type="number"
          id="#tasks"
          min={1}
          value={gameSettings.n_tasks}
          onChange={(event) =>
            changeValue("n_tasks", event.target.valueAsNumber)
          }
        ></input>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <label htmlFor="#common_tasks"># Common Tasks: </label>
        <input
          type="number"
          id="#common_tasks"
          min={0}
          value={gameSettings.n_common_tasks}
          onChange={(event) =>
            changeValue("n_common_tasks", event.target.valueAsNumber)
          }
        ></input>
      </div>
    </div>
  );
};
