# Generator

To enable this feature, set GENERATOR to 1 in .env  
To disable this feature, set GENERATOR to 0 in .env

[Requests](./generator.http)  

## About

**Generator enabled:**

* On app start, generator generates API CRUD endpoints which are publicly accessible
* Generator takes /modules/collections.json as an input

**Generator disabled:**

* Only custom API endpoints are accessible
* Custom API endpoints can be created using /modules/custom-object

**Input**

```/modules/collections.json```
  
**Output**

GQL CRUD API with basic querying capabilities:

- query one
- query all (filter, search, skip, take, sort)
- create
- update
- delete

Check graphiql generated docs for more info