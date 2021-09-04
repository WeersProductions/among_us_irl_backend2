export interface Task {
  // Name that is used on display.
  name: string;
  // Unique.
  id: string;
  // If true, this task can be one of the common tasks
  can_be_common: boolean;
  // If set, this task will be replaced by this task id
  next_phase_id?: string;
  // If true, the first random selection of tasks can include this task
  can_be_selected_first: boolean;
}

export const tasks: Task[] = [
  {
    name: "Electric wires",
    id: "electric_wires",
    can_be_common: true,
    next_phase_id: "another_task",
    can_be_selected_first: true,
  },
  {
    name: "Electric wires",
    id: "electric_wires2",
    can_be_common: false,
    can_be_selected_first: false,
  },
  {
    name: "Space ship",
    id: "space_ship",
    can_be_common: true,
    can_be_selected_first: false,
  },
  {
    name: "Fuel tank",
    id: "fuel_tank",
    can_be_common: true,
    can_be_selected_first: true,
  },
  {
    name: "Clear asteroids",
    id: "clear_asteroids",
    can_be_common: true,
    can_be_selected_first: true,
  },
  {
    name: "Record temperature",
    id: "record_temperature",
    can_be_common: true,
    can_be_selected_first: true,
  },
  {
    name: "Beer pong",
    id: "beer_pong",
    can_be_common: true,
    can_be_selected_first: true,
  },
];
