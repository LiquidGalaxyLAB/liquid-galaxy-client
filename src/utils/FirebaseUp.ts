export class FirebaseUp {
  [entry: string]: FirebaseUpEntry;
}

export class FirebaseUpEntry {
  localIp: string;
  port: number;
  timestamp: number;
}
