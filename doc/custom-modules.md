# Custom modules

To enable this feature, set CUSTOM_MODULES to 1 in .env  
To disable this feature, set CUSTOM_MODULES to 0 in .env

## About

This is a place for custom GQL types and resolvers.

Usage:

* Create /modules/my-object
* Create /modules/my-object/types.js
* Add created object to /modules/types.js moduleTypes list
* Create /modules/my-object/resolvers.js
* Add created object to /modules/resolvers.js moduleResolvers list