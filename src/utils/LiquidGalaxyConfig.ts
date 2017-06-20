import { FirebaseConfig, DEFAULT_FIREBASE_CONFIG  } from './FirebaseConfig';

export class LiquidGalaxyConfig {
  firebase: FirebaseConfig;
}

export const DEFAULT_LIQUID_GALAXY_CONFIG: LiquidGalaxyConfig = {
  firebase: DEFAULT_FIREBASE_CONFIG,
};
