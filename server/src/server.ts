import http from 'http';

import { app } from './app';
import { env } from './config/env';
import { startApollo } from './graphql';

const httpServer = http.createServer(app);

(async function bootstrap() {
  await startApollo(httpServer);

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: env.LISTENING_PORT }, resolve)
  );

  console.log(`HTTP server is running on http://localhost:${env.LISTENING_PORT} [env: ${env.NODE_ENV}]`);
})();