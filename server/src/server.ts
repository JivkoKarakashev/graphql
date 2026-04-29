import http from 'http';

import { app } from './app';
import { env } from './config/env';
import { startApollo } from './graphql';
import { waitForDb } from './scripts/waitForDb';
import { errorHandler } from './middleware/errorHandler';

const httpServer = http.createServer(app);

(async function bootstrap() {
  try {
    console.log('Starting server...');
    // 1. Wait DB
    await waitForDb();
    // 2. Start API
    await startApollo(app, httpServer);

    app.use(errorHandler);

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: env.LISTENING_PORT }, resolve)
    );

    console.log(`HTTP server is running on http://localhost:${env.LISTENING_PORT} [env: ${env.NODE_ENV}]`);
  } catch (err) {
    console.error('Startup failed: ', err);
    process.exit(1);
  }
})();