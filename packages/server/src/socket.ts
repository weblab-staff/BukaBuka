import type http from 'http'
import {Server} from 'socket.io';

let io: Server;
let test: number = 0;

export function startSockets(server: http.Server ) {
    io = new Server(server);
    console.log("Listening for socket connections");
}

export function emitHappinessLevel(level: number) {
    io.emit("happinessLevel", level);
}