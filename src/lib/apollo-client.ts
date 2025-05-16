import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/graphql`,
  cache: new InMemoryCache(),
});
