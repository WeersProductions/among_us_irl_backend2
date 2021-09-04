export function isPermanentDisconnect(reason: string): boolean {
  return reason !== "io server disconnect" && reason !== "io client disconnect";
}
