import type http from 'http'
import {Server} from 'socket.io';

let io: Server;

export function startSockets(server: http.Server ): void {
    io = new Server(server);
    // eslint-disable-next-line no-console
    console.log("Listening for socket connections");
}

export function emitHappinessLevel(level: number): void {
    io.emit("happinessLevel", level);
}