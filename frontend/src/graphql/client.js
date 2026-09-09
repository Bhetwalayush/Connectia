// Apollo Client configuration with WebSocket support for subscriptions
import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";

import { GraphQLWsLink } from "@apollo/client/link/subscriptions";

import { createClient } from "graphql-ws";

import { getMainDefinition } from "@apollo/client/utilities";
import authLink from "./authLink";

// HTTP connection for queries and mutations
const httpLink = new HttpLink({
  uri: "http://localhost:8000/graphql",
  credentials: "include",
});

// WebSocket connection for real-time subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:8000/graphql",
  }),
);

// Split link: use WebSocket for subscriptions, HTTP for queries/mutations
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },

  wsLink,
  authLink.concat(httpLink),
);

// Initialize Apollo Client with cache and link configuration
export const apolloClient = new ApolloClient({
  link: splitLink,

  cache: new InMemoryCache(),
});
