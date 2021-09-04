export interface CurrentConnection {
  name: string;
  id: number;
  imposter?: boolean;
}

export interface CurrentConnectionInfo {
  totalConnectionCount: number;
  loggedInConnections: CurrentConnection[];
}

export interface AdminInfo {
  connectionInfo?: CurrentConnectionInfo;
}
