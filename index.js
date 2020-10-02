import './extensions'

import polka from 'polka'
import graphqlHTTP from 'express-graphql'

import { makeExecutableSchema } from "graphql-tools"
import { mergeTypes, mergeResolvers } from "merge-graphql-schemas"

import authorization from './middleware/authorization'
import logger from './middleware/logger'

import generatedTypes from './gql-modules/generator/generated-types'
import generatedResolvers from './gql-modules/generator/generated-resolvers'

import customTypes from './gql-modules/custom/custom-types'
import customResolvers from './gql-modules/custom/custom-resolvers'

const typeDefs = mergeTypes([generatedTypes, customTypes], { all: true })
const resolvers = mergeResolvers([generatedResolvers, customResolvers])

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

polka()
  .use(authorization)
  .use(logger)
  .use(
    '/graphql',
    graphqlHTTP({
      schema: schema,
      graphiql: true,
    }),
  )
  .listen(process.env.PORT, err => {
    if (err) throw err;
    console.log(`> Running a GraphQL API server at http://localhost:${process.env.PORT}/graphql`);
  }); 
