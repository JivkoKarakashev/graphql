export const authTypeDefs = `#graphql
  type AuthPayload {
    accessToken: String!
    user: UserProfile!
  }

  type UserProfile {
    id: ID!
    username: String!
    email: String!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  extend type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    logoutAll: Boolean!
  }

  extend type Query {
    me: UserProfile
  }
`;