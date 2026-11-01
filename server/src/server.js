import http from 'http';
import { Server } from 'socket.io';
import app, { getAllowedOrigins } from './app.js';
import { connectDB } from './config/db.js';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: getAllowedOrigins(),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

app.set('io', io);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`[Orange Cab Server] running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`[API Base] http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error(`[Orange Cab Server] Unable to start: ${error.message}`);
    process.exitCode = 1;
  });

process.on('uncaughtException', (error) => {
  console.error('[Uncaught Exception]:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Rejection]:', reason);
});
