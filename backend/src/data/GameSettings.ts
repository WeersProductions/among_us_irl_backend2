export interface GameSettings {
  n_imposters: number;
  n_tasks: number;
  n_common_tasks: number;
}

export const defaultGameSettings: GameSettings = {
  n_imposters: 2,
  n_common_tasks: 3,
  n_tasks: 7,
};
