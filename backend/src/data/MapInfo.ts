export interface MapInfo {
  // Maps from a QR ID to a location on the map.
  qr_locations: Record<string, number>;
}

export const default_map: MapInfo = {
  qr_locations: {
    QR: 1,
    "ANOTHER QR": 2
  }
};
