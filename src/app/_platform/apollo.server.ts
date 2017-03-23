import { ApolloClient, createNetworkInterface } from 'apollo-client';

const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/ciyob6fnu3qjl01329outsfgk'
});

export const serverClient = new ApolloClient({
  networkInterface,
  ssrMode: true
});

export function provideServerClient() {
  return serverClient;
}
