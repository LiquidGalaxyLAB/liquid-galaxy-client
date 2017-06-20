import * as socketioClient from 'socket.io-client';

function socketKml(socket: any) {
  const emit = promisifyEmit();

  function writeKML(contents: string): Promise<void> {
    return emit('P:/kmls', { contents });
  }

  function writeHrefKML(uri: string): Promise<void> {
    return emit('P:/kmls', { uri });
  }

  function writeQuery(contents: string) {
    return emit('P:/queries', { contents });
  }

  function promisifyEmit(): Function {
    const subject = socket;
    const fun = socket.emit;
    return (...args: any[]): Promise<any> => (
      new Promise((resolve) => {
        fun.call(subject, ...args, () => {
          resolve();
        });
      })
    );
  }

  return {
    writeKML,
    writeHrefKML,
    writeQuery,
  };
}

export class LiquidGalaxyServer {
  public readonly uri: string;

  private socket: any;
  private onEstablishedListeners: (() => void)[] = [];
  private onDroppedListeners: (() => void)[] = [];

  constructor(uri: string) {
    this.uri = uri;
  }

  connect() {
    if (this.socket) {
      // Socket was already initialized. Reconnect.
      this.socket.socket.connect();
      return;
    }
    this.socket = socketioClient.connect(this.uri);
    this.socket.on('connect', () => this.emitEstablished());
    this.socket.on('disconnect', () => this.emitDropped());
  }

  disconnect() {
    this.socket.disconnect();
  }

  onConnectionEstablished(callback: () => void) {
    this.onEstablishedListeners.push(callback);
  }

  onConnectionDropped(callback: () => void) {
    this.onDroppedListeners.push(callback);
  }

  private emitEstablished() {
    this.onEstablishedListeners.forEach((callback) => {
      callback();
    });
  }

  private emitDropped() {
    this.onDroppedListeners.forEach((callback) => {
      callback();
    });
  }

  kml() {
    if (!this.socket) {
      console.error('No connection has been initialized. Call connect() first!');
      return;
    }
    return socketKml(this.socket);
  }
}
