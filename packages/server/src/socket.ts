import type http from 'http';
import { Server } from 'socket.io';

let io: Server;

export function startSockets(server: http.Server): void {
  io = new Server(server);
  // eslint-disable-next-line no-console
  console.log('Listening for socket connections');
}

export function emitHappinessLevel(level: number): void {
  io.emit('happiness', level);
}

export function emitAwakeEvent(): void {
  io.emit('awake', true);
}

export function emitSleepEvent(): void {
  io.emit('sleep', true);
}