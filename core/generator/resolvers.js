import dotenv from 'dotenv'
dotenv.config()

import pluralize from 'pluralize'
import { mergeResolvers } from "merge-graphql-schemas"
import db from '../../db'
import baseTypes from "../baseTypes.json"
import coreCollections from "../collections.json"
import moduleCollections from "../../modules/collections.json"

const collections = [...coreCollections, ...moduleCollections]

const checkPrivileges = async (collection, isCreate) => {
  const isAdmin = false // TODO: is logged in user Admin ?
  const admin = await db.get('users').findOne({ isAdmin: true })
  const sensitiveCollections = (collection == 'users' || collection == 'user' || collection == 'privilege' || collection == 'privileges')

  if (isCreate && !admin) return
  if (sensitiveCollections && isAdmin) return
  if (!sensitiveCollections) return

  throw new Error('Unauthorized')
}

const getCollectionItem = (collection) => {
  const fn = async (parent, { _id }, context, info) => {
    await checkPrivileges(collection)

    return await db.get(collection).findOne({_id: _id});
  };
  return fn;
}

const getCollection = (collection) => {
  const fn = async (parent, {filter, search, take, skip, sort}, context, info) => {
    await checkPrivileges(collection)
    
    let fAnd = {};
    let f = [];
    if (filter) {
      filter.forEach(item => {
        f.push({[item.field]: item.value})
      });      
    }

    if (search) {
      search.forEach(item => {
        f.push({[item.field]: new RegExp(item.value)})
      }) 
    }

    fAnd = f.length > 0 ? {"$and": f} : {}
    
    let s = {};
    if (sort) {
      sort.forEach(item => {
        s[item.field] = (item.sort == "asc") ? 1 : -1;
      });
    }

    return await db.get(collection).find(fAnd, {
      skip: skip,
      limit: take,
      sort: s
    });
  }

  return fn;
}

const createCollectionItem = (collection, fields) => {
  const fn = async (parent, args, context, info) => {
    await checkPrivileges(collection, true)

    let entity = {}

    fields.forEach(item => {
      entity = {...{...entity}, [item.name]: args[`${collection}`][item.name] }
    })

    return await db.get(`${collection}s`).insert(entity);
  }
  return fn;
}

const updateCollectionItem = (collection) => {
  const fn = async (parent, {_id, author}, context, info) => {
    await checkPrivileges(collection)

    const updated = await db.get(collection).findOne({_id: _id});
    if (!updated) return {};
    await db.get(collection).update({_id: _id}, { $set: author });
    return updated;
  }
  return fn;
}

const deleteCollectionItem = (collection) => {
  const fn = async (parent, {_id}, context, info) => {
    await checkPrivileges(collection)

    const removed = await db.get(collection).findOne({_id: _id});
    if (!removed) return {};
    await db.get(collection).remove({_id: _id})
    return removed;
  }
  return fn;
}

const getRelations = (collection) => {

  const cSingularLower = collection.collection.toLowerCase();

  let result = {}

  collection.fields.forEach(item => {

    if (!baseTypes.includes(item.type) && item.type.includes("[")) {
      const fPluralLower = pluralize(item.type.replace("[", "").replace("]", "")).toLowerCase()

      result = {
        ...{...result},
        [fPluralLower]: async (obj) => {
          return await db.get(fPluralLower).find({[cSingularLower]: obj._id})
        }
      }
    }

    if (!baseTypes.includes(item.type) && !item.type.includes("[")) {
      const fSingularLower = item.type.toLowerCase()
      const fPluralLower = pluralize(item.type.toLowerCase());


      result = {
        ...{...result},
        [fSingularLower]: async(obj) => {
          return await db.get(fPluralLower).findOne({_id: obj[fSingularLower]})
        }
      }
      
    }

  })

  return result
}

const getResolvers = (collections) => {

  let result = []
  collections.forEach(item => {

    const cPluralLower = pluralize(item.collection.toLowerCase())
    const cSingularLower = item.collection.toLowerCase()
    const cSingularFirstUpper = item.collection.toFirstLetterUpperCase()

    let schema = {
      Query: {
        [cSingularLower]: getCollectionItem(cPluralLower),
        [cPluralLower]: getCollection(cPluralLower),
      },
      [cSingularFirstUpper]: getRelations(item),
    }

    if (process.env.PRIVILEGES.toBool()) {
      schema.Mutation = {
        [`create${cSingularFirstUpper}`]: createCollectionItem(cSingularLower, item.fields),
        [`update${cSingularFirstUpper}`]: updateCollectionItem(cPluralLower),
        [`delete${cSingularFirstUpper}`]: deleteCollectionItem(cPluralLower)
      }
    }

    result = [
      ...result, 
      schema
    ]
  })

  result = [...result]
  
  return mergeResolvers(result)
}

const resolvers = getResolvers(collections)

export default resolvers