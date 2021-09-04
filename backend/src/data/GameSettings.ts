export interface GameSettings {
  n_imposters: number;
  n_tasks: number;
  n_common_tasks: number;
}

export const default_gamesettings: GameSettings = {
  n_imposters: 2,
  n_common_tasks: 3,
  n_tasks: 7
};
