const collections = [
  {
    "collection": "Privilege",
    "fields": [
      {
        "name": "objectName",
        "type": "String"
      },
      {
        "name": "privilege",
        "type": "String"
      }
    ]
  },
  {
    "collection": "User",
    "fields": [
      {
        "name": "privilege",
        "type": "Privilege"
      },
      {
        "name": "isAdmin",
        "type": "Boolean"
      }
    ]
  }
]

export default collections