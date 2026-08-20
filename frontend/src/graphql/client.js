import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";

import { GraphQLWsLink } from "@apollo/client/link/subscriptions";

import { createClient } from "graphql-ws";

import { getMainDefinition } from "@apollo/client/utilities";
import authLink from "./authLink";

const httpLink = new HttpLink({
  uri: "http://localhost:8000/graphql",
  credentials: "include",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:8000/graphql",
    connectionParams: () => {
      const token = localStorage.getItem("token");

      return token ? { authorization: `Bearer ${token}` } : {};
    },
  }),
);

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

export const apolloClient = new ApolloClient({
  link: splitLink,

  cache: new InMemoryCache(),
});
