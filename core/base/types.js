const coreTypes = 
`
scalar Upload

enum Sort {
  asc
  desc
}

input FieldValueInput {
  field: String,
  value: String
}

input SortInput {
  field: String
  sort: Sort
}
`

export default coreTypes
