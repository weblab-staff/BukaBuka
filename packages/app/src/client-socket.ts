/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-console */
import { io } from 'socket.io-client';

const endpoint = window.location.hostname + ':' + window.location.port;

export const socket = io(endpoint);

socket.on('connect', () => {
  console.log('Socket connected.');
});

export default socket;
