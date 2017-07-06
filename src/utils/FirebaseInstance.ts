import * as firebase from 'firebase';

import config from '../config';
import { FirebaseConfig } from './FirebaseConfig';

export class FirebaseInstance {
  firebase: firebase.app.App;

  constructor(config: FirebaseConfig) {
    this.firebase = firebase.initializeApp(config);
  }
}

export const DEFAULT_FIREBASE_INSTANCE = new FirebaseInstance(config.firebase);
