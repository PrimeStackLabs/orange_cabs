import 'dotenv/config';

import http from 'http';
import { Server } from 'socket.io';
import app, { getAllowedOrigins } from './app.js';
import { connectDB, getMongoUriDiagnostics } from './config/db.js';

const uri = process.env.MONGODB_URI;

console.log('[MongoDB Diagnostic]', getMongoUriDiagnostics(uri));

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: getAllowedOrigins(),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

app.set('io', io);

const safeErrorMessage = (error) => {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/mongodb(?:\+srv)?:\/\/[^\s"'<>]+/gi, '[MongoDB URI redacted]');
};

const startServer = async () => {
  try {
    console.log('[Orange Cab Server] Connecting to MongoDB Atlas...');

    await connectDB();

    console.log('[Orange Cab Server] MongoDB connected successfully.');

    server.listen(PORT, () => {
      console.log(
        `[Orange Cab Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
      );

      console.log(`[API Base] http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('\n[Orange Cab Server] Unable to start.');

    console.error('[Error Message]:', safeErrorMessage(error));

    console.error('[Error Code]:', error.code || 'Not available');

    process.exitCode = 1;
  }
};

startServer();

// Error handling
process.on('uncaughtException', (error) => {
  console.error('[Uncaught Exception]:', safeErrorMessage(error));
});

process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Rejection]:', safeErrorMessage(reason));
});
