import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import config from './config';

const typeDefs = `#graphql
  schema {
    query: Query
  }

  type Query {
      greeting: String
  }
`;

const resolvers = {
  Query: {
    greeting: () => 'Hello GraphQL!'
  },
};

(async function bootstrap() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, { listen: { port: config.port } });
  console.log(`HTTP server is listening on ${url} [env: ${config.env}]`);
})();
