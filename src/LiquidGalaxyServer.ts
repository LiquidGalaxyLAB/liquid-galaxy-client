import * as firebase from 'firebase';

import {
  FirebaseInstance,
  DEFAULT_FIREBASE_INSTANCE,
} from './utils';

export class LiquidGalaxyServer {
  serverUid: string;
  firebaseInstance: FirebaseInstance;

  constructor(serverUid: string, firebaseInstance?: FirebaseInstance) {
    this.serverUid = serverUid;
    this.firebaseInstance = firebaseInstance || DEFAULT_FIREBASE_INSTANCE;
  }

  writeKML(contents: string): Promise<void> {
    return this.writeToQueue('kml:value', contents);
  }

  writeHrefKML(uri: string): Promise<void> {
    return this.writeToQueue('kml:href', uri);
  }

  writeQuery(contents: string): Promise<void> {
    return this.writeToQueue('queries', contents);
  }

  private writeToQueue(type: string, value: string): Promise<void> {
    return new Promise<void>((resolve) => {
      const dbRef = this.firebaseInstance.firebase.database().ref(`queue/${this.serverUid}`);
      const entry = {
        type,
        value,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      };
      dbRef.push(entry, () => resolve());
    });
  }
}
