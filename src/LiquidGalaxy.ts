import * as ip from 'what-is-my-ip-address';

import {
  FirebaseInstance,
  DEFAULT_FIREBASE_INSTANCE,
} from './utils';
import { FirebaseLiquidGalaxyServer } from './models';
import { LiquidGalaxyServer } from './LiquidGalaxyServer';

export class LiquidGalaxy {
  firebaseInstance: FirebaseInstance;

  constructor(firebaseInstance?: FirebaseInstance) {
    this.firebaseInstance = firebaseInstance || DEFAULT_FIREBASE_INSTANCE;
  }

  /**
   * Find nearby online servers. Currently, it's just an alias of findServersThroughFirebase().
   * @see findServersThroughFirebase()
   */
  findServers(): Promise<LiquidGalaxyServer[]> {
    return this.findServersThroughFirebase();
  }

  /**
   * Finds online servers on the same network by using Firebase alive statuses.
   * Otherwise state, they are fetched from a global Firebase repository.
   * 
   * Servers are considered alive if marked as online and have reported activity in the last 120 
   * seconds.
   */
  findServersThroughFirebase(): Promise<LiquidGalaxyServer[]> {
    return new Promise<LiquidGalaxyServer[]>(async (resolve) => {
      const ip = await this.getPublicFirebaseLikeIp();
      this.firebaseInstance.firebase.database()
        .ref(`ips/${ip}`)
        .orderByChild('lastOnline')
        .startAt(Date.now() - 120 * 1000) // Last 120 seconds only.
        .once('value', (snapshot: firebase.database.DataSnapshot) => {
          resolve(this.serversFromFirebaseDataSnapshot(snapshot));
        });
    });
  }

  private async getPublicFirebaseLikeIp(): Promise<string> {
    const currentIp: string = await ip.v4();
    const encodedIp = currentIp.replace(/\./g, ':');
    return encodedIp;
  }

  private serversFromFirebaseDataSnapshot(
    snapshot: firebase.database.DataSnapshot,
  ): LiquidGalaxyServer[] {
    const servers = snapshot.val();
    if (!servers) {
      return [];
    }

    return Object.entries(servers)
      .filter(([, info]: [string, FirebaseLiquidGalaxyServer]) => (
        info.isOnline // < 120 sec. are filtered by the Firebase query.
      ))
      .map(([uid, info]: [string, FirebaseLiquidGalaxyServer]) => (
        new LiquidGalaxyServer(uid, info, this.firebaseInstance)
      ));
  }
}
