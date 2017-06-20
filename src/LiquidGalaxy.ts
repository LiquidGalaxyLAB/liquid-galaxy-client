import * as firebase from 'firebase';
import * as publicIp from 'public-ip';

import {
  LiquidGalaxyConfig,
  DEFAULT_LIQUID_GALAXY_CONFIG,
  FirebaseUp,
} from './utils';
import { LiquidGalaxyServer } from './LiquidGalaxyServer';

export class LiquidGalaxy {
  private config: LiquidGalaxyConfig;
  private firebaseRef: firebase.app.App;

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
  async findLANServersThroughFirebase(): Promise<LiquidGalaxyServer[]> {
    this.initializeFirebase();
    const db = this.firebaseRef.database();
    const ip = await this.getPublicFirebaseLikeIp();

    return new Promise<LiquidGalaxyServer[]>((resolve) => {
      db.ref(`up/${ip}`).on('value', (snapshot: firebase.database.DataSnapshot) => {
        const up: FirebaseUp = snapshot.val();
        const servers: LiquidGalaxyServer[] = up && Object.keys(up).map((upKey) => {
          const { localIp, port } = up[upKey];
          return new LiquidGalaxyServer(`http://${localIp}:${port}`);
        });
        return resolve(servers);
      });
    });
  }

  /**
   * Initializes Firebase connection (if it's not already initialized).
   */
  private initializeFirebase() {
    if (this.firebaseRef) {
      return;
    }
    this.firebaseRef = firebase.initializeApp(this.config.firebase);
  }

  private async getPublicFirebaseLikeIp(): Promise<string> {
    const ip: string = await publicIp.v4();
    const ipConverted = ip.replace(/\./g, '%');
    return ipConverted;
  }
}
