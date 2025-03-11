import { Server } from 'http';
import app from './app';
import { WebSocket, WebSocketServer } from 'ws';
import seedSuperAdmin from './app/DB';
import config from './app/config';

const port = config.port || 5001;

interface ExtendedWebSocket extends WebSocket {
  roomId?: string;
  userId?: string;
}

async function main() {
  const server: Server = app.listen(port, () => {
    console.log('Sever is running on port ', port);
    seedSuperAdmin();
  });

  // const activeUsers: Map<string, boolean> = new Map();

  // Initialize WebSocket server
  const wss = new WebSocketServer({ server });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info('Server closed!');
      });
    }
    process.exit(1);
  };

  process.on('uncaughtException', (error) => {
    console.log(error);
    exitHandler();
  });

  process.on('unhandledRejection', (error) => {
    console.log(error);
    exitHandler();
  });
}

main();
