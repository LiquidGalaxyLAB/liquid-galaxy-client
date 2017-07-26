import * as firebase from 'firebase';

import {
  FirebaseInstance,
  DEFAULT_FIREBASE_INSTANCE,
} from './utils';
import { FirebaseLiquidGalaxyServer } from './models';

export class LiquidGalaxyServer {
  uid: string;
  info: FirebaseLiquidGalaxyServer;
  firebaseInstance: FirebaseInstance;

  constructor(
    uid: string,
    info: FirebaseLiquidGalaxyServer,
    firebaseInstance?: FirebaseInstance,
  ) {
    this.uid = uid;
    this.info = info;
    this.firebaseInstance = firebaseInstance || DEFAULT_FIREBASE_INSTANCE;
  }

  writeKML(contents: string): Promise<void> {
    return this.writeToQueue('kml:value', contents);
  }

  writeHrefKML(uri: string): Promise<void> {
    return this.writeToQueue('kml:href', uri);
  }

  cleanKml(): Promise<void> {
    return this.writeToQueue('kml:clean');
  }

  writeQuery(contents: string): Promise<void> {
    return this.writeToQueue('queries', contents);
  }

  private writeToQueue(type: string, value?: string): Promise<void> {
    return new Promise<void>((resolve) => {
      const dbRef = this.firebaseInstance.firebase.database().ref(`queue/${this.uid}`);
      const entry = {
        type,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        ...value ? { value } : {},
      };
      dbRef.push(entry, () => resolve());
    });
  }
}
