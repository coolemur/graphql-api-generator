import './extensions'

import cors from 'cors'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import { graphqlUploadExpress } from 'graphql-upload'

import { makeExecutableSchema } from "graphql-tools"
import { mergeTypes, mergeResolvers } from "merge-graphql-schemas"

import authorization from './middleware/authorization'
import logger from './middleware/logger'

import coreTypes from './gql-core/core-types'
import coreResolvers from './gql-core/core-resolvers'

import generatedTypes from './gql-modules/generator/generated-types'
import generatedResolvers from './gql-modules/generator/generated-resolvers'

import customTypes from './gql-modules/custom/custom-types'
import customResolvers from './gql-modules/custom/custom-resolvers'

const typeDefs = mergeTypes([coreTypes, generatedTypes, customTypes,], { all: true })
const resolvers = mergeResolvers([coreResolvers, generatedResolvers, customResolvers,])

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

express()
  .use(cors({
    credentials: true,
    origin: [
      'http://localhost:3000',
      'https://localhost:3000',
    ],
  }))
  .use(authorization)
  .use(logger)
  .use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
    graphqlHTTP({
      schema: schema,
      graphiql: true,
    }),
  )
  .listen(process.env.PORT, err => {
    if (err) throw err;
    console.log(`> Running a GraphQL API server at http://localhost:${process.env.PORT}/graphql`);
  }); 
