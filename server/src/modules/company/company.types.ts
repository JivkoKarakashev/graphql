export const companyTypeDefs = `#graphql
  type Owner {
    id: ID!
    username: String!
    email: String!
  }

  type Company {
    id: ID!
    name: String!
    description: String!
    logo: String
    website: String
    owner: Owner!
  }

  type CompanySearchResult {
    companies: [Company!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
    hasNextPage: Boolean!
  }

  input CreateCompanyInput {
    name: String!
    description: String!
    logo: String
    website: String
  }

  input UpdateCompanyInput {
    name: String
    description: String
    logo: String
    website: String
  }

  input SearchCompanyInput {
    query: String
    page: Int
    limit: Int
  }

  extend type Query {
    company(id: ID!): Company!
    myCompanies: [Company!]!
    searchCompanies(input: SearchCompanyInput!): CompanySearchResult!
  }

  extend type Mutation {
    createCompany(input: CreateCompanyInput!): Company!
    updateCompany(id: ID!, input: UpdateCompanyInput!): Company!
    deleteCompany(id: ID!): Boolean!
  }
`;