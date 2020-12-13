import dotenv from 'dotenv'
dotenv.config()
import './extensions'

import cors from 'cors'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import { graphqlUploadExpress } from 'graphql-upload'

import { makeExecutableSchema } from "graphql-tools"
import { mergeTypes, mergeResolvers } from "merge-graphql-schemas"

import authorization from './middleware/authorization'
import logger from './middleware/logger'

import coreTypes from './core/base/types'
import coreResolvers from './core/base/resolvers'

import generatorTypes from './core/generator/types'
import generatorResolvers from './core/generator/resolvers'

import moduleTypes from './modules/types'
import moduleResolvers from './modules/resolvers'

const typeDefs = mergeTypes([coreTypes, process.env.GENERATOR.toBool() ? generatorTypes : [], moduleTypes,], { all: true })
const resolvers = mergeResolvers([coreResolvers, process.env.GENERATOR.toBool() ? generatorResolvers : [], moduleResolvers,])

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
