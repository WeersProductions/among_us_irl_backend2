export interface MapInfo {
  // Maps from a QR ID to a location on the map.
  qrLocations: Record<string, number>;
  // task_id to location_id
  usedLocations: Record<string, number>;
}

export const DEFAULT_MAP: MapInfo = {
  qrLocations: {
    clear_asteroids: 4,
    beer_pong: 1,
    fuel_tank: 5,
    space_ship: 3,
    swipe_card: 2,
    record_temperature: 0,
    electric_wires: 7,
    another_task: 6,
    bagger_quotes: 8,
  },
  usedLocations: {},
};
