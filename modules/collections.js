const collections = [
  {
    "collection": "Author",
    "fields": [
      {
        "name": "firstName",
        "type": "String"
      },
      {
        "name": "lastName",
        "type": "String"
      },
      {
        "name": "posts",
        "type": "[Post]"
      }
    ]
  },
  {
    "collection": "Post",
    "fields": [
      {
        "name": "title",
        "type": "String"
      },
      {
        "name": "author",
        "type": "Author"
      },
      {
        "name": "votes",
        "type": "Int"
      }
    ]
  }
]

export default collections