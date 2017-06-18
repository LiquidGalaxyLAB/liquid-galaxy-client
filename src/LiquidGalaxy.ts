import { LiquidGalaxyServer } from './LiquidGalaxyServer';

export class LiquidGalaxy {
  constructor(config: LiquidGalaxyConfig) {

  }

  /**
   * Find online servers. Currently, only servers on the same network will be found.
   */
  findServers(): LiquidGalaxyServer[] {
    return this.findLANServers();
  }

  /**
   * Finds online servers on the same network.
   */
  findLANServers(): LiquidGalaxyServer[] {

  }

}