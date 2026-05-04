export const userTypeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
  }

  extend type Query {
    users: [User!]!
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User!
  }

  input CreateUserInput {
    username: String!
    email: String!
    password: String!
  }
`;