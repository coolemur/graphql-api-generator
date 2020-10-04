import pluralize from 'pluralize'
import { mergeTypes } from "merge-graphql-schemas"
import collections from "./collections.json"

const baseTypes = ["String", "Int"]

const getFieldsStr = (fields, p) => {
  let result = ``
  fields.forEach(field => {
    if (baseTypes.includes(field.type) || p)
    result = `${result}
        ${field.name}: ${field.type}`
  })
  return result
}

const getTypeDefs = (collections) => {

  let result = []
  collections.forEach(item => {
    const cPluralLower = pluralize(item.collection.toLowerCase());
    const cSingularLower = item.collection.toLowerCase();
    const cSingularFirstUpper = item.collection.toFirstLetterUpperCase();

    const fieldsStrP = getFieldsStr(item.fields, true)
    const fieldsStr = getFieldsStr(item.fields, false)

    result = [
      ...result,
      `
      type ${cSingularFirstUpper} {
        _id: ID${fieldsStrP}
      }
      type Query {
        ${cSingularLower}(_id: ID!): ${cSingularFirstUpper}
        ${cPluralLower}(filter: [FieldValueInput], search: [FieldValueInput], skip: Int, take: Int, sort: [SortInput]): [${cSingularFirstUpper}!]!
      }
      input ${cSingularFirstUpper}Input {${fieldsStr}
      }
      type Mutation {
        create${cSingularFirstUpper}(${cSingularLower}: ${cSingularFirstUpper}Input): ${cSingularFirstUpper}!
        update${cSingularFirstUpper}(_id: ID!, ${cSingularLower}: ${cSingularFirstUpper}Input!): ${cSingularFirstUpper}!
        delete${cSingularFirstUpper}(_id: ID!): ${cSingularFirstUpper}!
      }
      `
    ]
  })

  return mergeTypes(result, { all: true })
}


const typeDefs = getTypeDefs(collections)


export default typeDefs