export class FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;

  constructor(values?: Object) {
    Object.assign(this, values);
  }
}
