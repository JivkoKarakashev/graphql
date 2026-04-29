import { Express } from 'express';
import http from 'http';

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware as apolloMiddleware } from '@as-integrations/express5';

import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { createContext } from './context';
import { env } from '../config/env';

export const startApollo = async (app: Express, httpServer: http.Server) => {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (formattedError, err) => {
      if (env.NODE_ENV === 'production' && formattedError.extensions?.code === 'INTERNAL_SERVER_ERROR') {
        return {
          message: 'Something went wrong!',
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        }
      }
      return formattedError;
    }
  });

  await apolloServer.start();

  app.use('/graphql', apolloMiddleware(apolloServer, {
    context: ({ req, res }) => createContext({ req, res })
  }));
};