import { mergeTypes } from "merge-graphql-schemas"
import customObjectTypes from './custom-object/types'
const moduleTypes = process.env.CUSTOM_MODULES.toBool() ? [customObjectTypes] : []
export default mergeTypes(moduleTypes, { all: true })