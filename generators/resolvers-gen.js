import pluralize from 'pluralize'
import {mergeResolvers} from "merge-graphql-schemas"
import db from '../db'
import collections from "../_collections";

import customResolvers from '../custom/custom-resolvers'

const baseTypes = ["String", "Int"]

const getCollectionItem = (collection) => {
  const fn = async (parent, { _id }, context, info) => {
    return await db.get(collection).findOne({_id: _id});
  };
  return fn;
}

const getCollection = (collection) => {
  const fn = async (parent, {filter, search, take, skip, sort}, context, info) => {
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
    const updated = await db.get(collection).findOne({_id: _id});
    if (!updated) return {};
    await db.get(collection).update({_id: _id}, { $set: author });
    return updated;
  }
  return fn;
}

const deleteCollectionItem = (collection) => {
  const fn = async (parent, {_id}, context, info) => {
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

    result = [
      ...result, 
      {
        Query: {
          [cSingularLower]: getCollectionItem(cPluralLower),
          [cPluralLower]: getCollection(cPluralLower),
        },
        Mutation: {
          [`create${cSingularFirstUpper}`]: createCollectionItem(cSingularLower, item.fields),
          [`update${cSingularFirstUpper}`]: updateCollectionItem(cPluralLower),
          [`delete${cSingularFirstUpper}`]: deleteCollectionItem(cPluralLower)
        },
        [cSingularFirstUpper]: getRelations(item),
      }
    ]
  })

  result = [...result, customResolvers]

  return mergeResolvers(result)
}

const resolvers = getResolvers(collections)

export default resolvers