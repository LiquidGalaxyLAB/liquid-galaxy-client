import * as firebase from 'firebase';
import * as publicIp from 'public-ip';

import {
  FirebaseInstance,
  DEFAULT_FIREBASE_INSTANCE,
} from './utils';
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
        .on('value', (snapshot: firebase.database.DataSnapshot) => {
          resolve(this.serversFromFirebaseDataSnapshot(snapshot));
        });
    });
  }

  private async getPublicFirebaseLikeIp(): Promise<string> {
    const ip: string = await publicIp.v4();
    const encodedIp = ip.replace(/\./g, ':');
    return encodedIp;
  }

  private serversFromFirebaseDataSnapshot(
    snapshot: firebase.database.DataSnapshot,
  ): LiquidGalaxyServer[] {
    const servers = snapshot.val();
    if (!servers) {
      return [];
    }

    return Object.keys(servers).map(serverUid => (
      new LiquidGalaxyServer(serverUid, config)
    ));
  }
}
