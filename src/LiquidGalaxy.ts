import * as firebase from 'firebase';
import * as publicIp from 'public-ip';

import {
  LiquidGalaxyConfig,
  DEFAULT_LIQUID_GALAXY_CONFIG,
  FirebaseUp,
  genTimeId,
} from './utils';
import { LiquidGalaxyServer } from './LiquidGalaxyServer';

export class LiquidGalaxy {
  private config: LiquidGalaxyConfig;

  constructor(config?: LiquidGalaxyConfig) {
    this.config = config || DEFAULT_LIQUID_GALAXY_CONFIG;
  }

  /**
   * Find online servers. Currently, it's just an alias of findLANServersThroughFirebase().
   * @see findLANServersThroughFirebase()
   */
  findServers(): Promise<LiquidGalaxyServer[]> {
    return this.findLANServersThroughFirebase();
  }

  /**
   * Finds online servers on the same network that are using Firebase to post their alive statuses.
   * It fetches them from a global firebase repository, unless otherwise specific in the config
   * constructor parameter. 
   * Servers are considered alive if that have reported activity in the last 120 seconds.
   */
  findLANServersThroughFirebase(): Promise<LiquidGalaxyServer[]> {
    return this.firebaseTempConnection((firebaseRef: firebase.app.App) => (
      new Promise<LiquidGalaxyServer[]>(async (resolve) => {
        const ip = await this.getPublicFirebaseLikeIp();
        firebaseRef.database()
          .ref(`up/${ip}`)
          .orderByChild('timestamp')
          .startAt(Date.now() - 120 * 1000) // Last 120 seconds only.
          .on('value', (snapshot: firebase.database.DataSnapshot) => {
            resolve(this.serversFromFirebaseDataSnapshot(snapshot));
          });
      })
    ));
  }

  private async firebaseTempConnection(execute: (firebaseRef: firebase.app.App) => Promise<any>) {
    const firebaseRef = firebase.initializeApp(this.config.firebase, `api-${genTimeId()}`);
    const executeResult = await execute(firebaseRef);
    firebaseRef.database().app.delete();
    return executeResult;
  }

  private serversFromFirebaseDataSnapshot(
    snapshot: firebase.database.DataSnapshot,
  ): LiquidGalaxyServer[] {
    const up: FirebaseUp = snapshot.val();
    const servers: LiquidGalaxyServer[] = up && Object.keys(up).map((upKey) => {
      const { localIp, port } = up[upKey];
      return new LiquidGalaxyServer(`http://${localIp}:${port}`);
    });
    const uniqueServers: LiquidGalaxyServer[] = this.excludeRepeated(servers);
    return uniqueServers;
  }

  private async getPublicFirebaseLikeIp(): Promise<string> {
    const ip: string = await publicIp.v4();
    const ipConverted = ip.replace(/\./g, '%');
    return ipConverted;
  }

  /**
   * Remove repeated Liquid Galaxy Servers.
   */
  private excludeRepeated(servers: LiquidGalaxyServer[]): LiquidGalaxyServer[] {
    return servers;
  }
}
