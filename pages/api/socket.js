import { Server } from 'socket.io';

let io;

export default function SocketHandler(req, res) {
  if (!io) {
    io = new Server(res.socket.server);
    io.on('connection', (socket) => {
      socket.on('new-message', (message) => {
        socket.broadcast.emit('receive-message', message);
      });
    });
  }
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
