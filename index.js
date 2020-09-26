import './extensions'

import polka from 'polka'
import graphqlHTTP from 'express-graphql'

import { makeExecutableSchema } from "graphql-tools"

import typeDefs from './generators/typeDefs-gen'
import resolvers from './generators/resolvers-gen'

import authorization from './middleware/authorization'
import logger from './middleware/logger'

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
  .listen(4000, err => {
    if (err) throw err;
    console.log(`> Running a GraphQL API server at http://localhost:4000/graphql`);
  }); 
