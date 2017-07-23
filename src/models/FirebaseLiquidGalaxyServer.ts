export class FirebaseLiquidGalaxyServer {
  displayName: string;
  hasPassword: boolean;
  isOnline: boolean;
  lastOnline: number;

  constructor(values?: Object) {
    Object.assign(this, values);
  }
}
