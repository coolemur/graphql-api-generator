const customTypeDefs = 
`
type CustomObject {
  _id: ID
}
type Query {
  customObjects: [CustomObject]
}
`

export default customTypeDefs
