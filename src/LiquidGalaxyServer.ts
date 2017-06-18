export class LiquidGalaxyServer {
  private connection;

  status: LiquidGalaxyServerStatus;
  kml: LiquidGalaxyKML;

  constructor(private config: LiquidGalaxyServerConfig) {}

  connect(): LiquidGalaxyServer {}
  disconnect(): LiquidGalaxyServer {}

  onConnectionEstablished(fun) {}
  onConnectionDropped(fun) {}
}
