const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    cars: [Car!]!
  }

  type Car {
    id: ID!
    color: String!
    make: String!
  }

  type ManualGroup{
    Image
    [GroupMembership]
  }

  type AutomaticGroup{
    Image
    [GroupMembership]
    [AutomaticGroupFeature]
  }

  type AutomaticGroupFeature {
    
  }

  type GroupMembership{
    Group
    Car
  }

`;

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      cars: () => [{ id: 1, color: "blue", make: "Toyota" }],
    },
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
