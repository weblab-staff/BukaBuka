import type http from 'http';
import { Server } from 'socket.io';

let io: Server;

export const startSockets = (server: http.Server): void => {
  io = new Server(server);
  // eslint-disable-next-line no-console
  console.log('Listening for socket connections');
};

export const emitHappinessLevel = (level: number): void => {
  io.emit('happiness', level);
};

export const emitAwakeEvent = (): void => {
  io.emit('awake', true);
};

export const emitSleepEvent = (): void => {
  io.emit('sleep', true);
};

export const emitQuestionEvent = (question: string): void => {
  io.emit('question', question);
};
