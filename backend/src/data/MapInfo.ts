export interface MapInfo {
  // Maps from a QR ID to a location on the map.
  qrLocations: Record<string, number>;
  // task_id to location_id
  usedLocations: Record<string, number>;
}

export const DEFAULT_MAP: MapInfo = {
  qrLocations: {
    QR: 1,
    "ANOTHER QR": 2,
    "ASDF": 3,
    "fdsa": 4,
    "jekjke": 5,
    "539": 6,
    "fjekjfke": 7,
    "jfkjekfnxx": 8,
    "werrrr": 9,
    "reurie": 10,
    "39jfdkn": 11
  },
  usedLocations: {},
};
