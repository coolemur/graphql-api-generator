import { mergeResolvers } from "merge-graphql-schemas"
import customObjectResolvers from './custom-object/resolvers.js'
const moduleResolvers = process.env.CUSTOM_MODULES.toBool() ? [customObjectResolvers] : []
export default mergeResolvers(moduleResolvers)