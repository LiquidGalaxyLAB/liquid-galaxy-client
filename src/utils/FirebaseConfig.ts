import config from '../config';

export class FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
}

export const DEFAULT_FIREBASE_CONFIG = config.firebase as FirebaseConfig;
