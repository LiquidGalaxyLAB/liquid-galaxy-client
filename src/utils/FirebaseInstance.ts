import * as firebase from 'firebase';

import config from '../config';
import { FirebaseConfig } from '../models/FirebaseConfig';
import { genTimeId } from './random';

export class FirebaseInstance {
  firebase: firebase.app.App;

  constructor(config: FirebaseConfig) {
    this.firebase = firebase.initializeApp(config, `api-${genTimeId()}`);
  }
}

export const DEFAULT_FIREBASE_INSTANCE = new FirebaseInstance(config.firebase);
