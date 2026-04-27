import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';

import cors from 'cors';
import { Router, json } from 'express';
import http from 'http';

import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { createContext } from './context';
import { env } from '../config/env';

export const startApollo = async (httpServer: http.Server) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
  });

  await server.start();

  // mount middleware
  const router = Router();

  router.use(
    '/',
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    }),
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) =>
        createContext({ req, res }),
    })
  );

  // attach to app
  const { app } = await import('../app');
  app.use('/graphql', router);
};