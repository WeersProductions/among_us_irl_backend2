export function isPermanentDisconnect(reason: string): boolean {
  return (
    reason === "server namespace disconnect" ||
    reason === "client namespace disconnect"
  );
}
