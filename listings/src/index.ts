import { resolvers } from './resolvers';
import { ListingAPI } from './datasources/listing-api';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import path from 'path';
import { gql } from 'graphql-tag';
import { buildSubgraphSchema } from '@apollo/subgraph';

const typeDefs = gql(
  readFileSync(path.resolve(__dirname, './schema.graphql'), {
    encoding: 'utf8',
  })
);
// https://kx8ld11f-4000.uks1.devtunnels.ms/
async function startApolloServer() {
  const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  });
  const { url } = await startStandaloneServer(server, {
    context: async () => {
      const { cache } = server;
      return {
        dataSources: {
          listingAPI: new ListingAPI({ cache }),
        },
      };
    },
  });

  console.log(`
    🚀  Server is running!
    📭  Query at ${url}
  `);
}

startApolloServer();
