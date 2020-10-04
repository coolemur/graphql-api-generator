import { GraphQLUpload } from 'graphql-upload'

const coreResolvers = {
  Upload: GraphQLUpload,

  Query: {
    customObjects() {
      return [];
    },
  },
}

export default coreResolvers