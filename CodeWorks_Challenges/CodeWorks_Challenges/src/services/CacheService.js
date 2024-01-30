import { dbContext } from "../db/DbContext.js"
import { BadRequest } from "../utils/Errors.js";

// NOTE I see how putting Cache on the database is redundant because I am creating duplicates of the data I am calling.
// My misunderstanding seems to be that I assumed a const cache = [] would be rewritten every time the service is accessed.Therfore every time someone would make a get request, cache would be set back to []
// That is not the case becuase the service it's self is not being created it is its constant cacheService that is being accessed.

// const cache = [] -- above class CacheService {}

// What kind of changes would be required to bring the existing cache system I have written in line with the correct methods of caching?
// Does the model need to be deleted? is that useful or could that be replaced with a sanitizeBody type of situation

// function cache(body) {
//   // Properties that are writable to cache
//   const cacheable = {
//     cacheId: body.cacheId, string ex: 'myMilestoneCache'
//     cachedData: body.data,
//     lastEmptied: body.lastEmptied,
//   }
//   return cacheable
// }

// All of the Asyncs would be removed and could use a more direct look up method
// such as object drilling


class CacheService {

  async checkCache(accountId, userId, cacheId) {
    const cache = await cacheService.getOrCreateCache(cacheId);
    const response = {}
    response.cacheItem = cacheService.getCacheItem(userId, cache);
    if (accountId != userId) {
      if (!response.cacheItem) {
        response.status = 'notFound'
      }
      if (response.cacheItem) {
        let expiration = cacheService.checkCacheItemExpiration(response.cacheItem, userId);
        if (expiration) {
          response.status = 'expired'
        }
      }
    } else {
      response.status = 'ownedByUser'
    }
    return response;
  }

  async getOrCreateCache(cacheId) {
    let foundCache = await this.getCache(cacheId)

    if (!foundCache) {
      foundCache = await this.createCache(cacheId);
    } else {
      const threeHoursAgo = Date.now() - 1.08e+7
      if (threeHoursAgo > foundCache.lastEmptied) {
        foundCache = await this.removeAllExpiredCacheItems(cacheId)
      }
    }

    return foundCache
  }

  async getCache(cacheId) {
    const foundCache = await dbContext.Cache.findOne({ cacheId })
    return foundCache
  }

  async createCache(cacheId) {
    const initializeCache = {};
    initializeCache.cacheId = cacheId;
    initializeCache.cachedData = [];
    return await dbContext.Cache.create(initializeCache);
  }

  getCacheItem(userId, cache) {
    const cacheItem = cache.cachedData.find((cd) => userId in cd)
    return cacheItem
  }
  async setCachedDataItem(userId, dataToCache, cacheId) {
    const cache = await this.getCache(cacheId)
    const expiresAt = Date.now() + 300000 // 5 Minutes
    const cacheItem = this.getCacheItem(userId, cache)
    if (!cacheItem) {
      const dataToPush = { [userId]: { dataToCache, expiresAt } }
      cache.cachedData.push(dataToPush)
    } else {
      cacheItem[dataToCache] = dataToCache
      cacheItem[expiresAt] = expiresAt
    }
    await cache.save()
    return cache.cachedData[userId]
  }

  async forceCacheItemUpdate(userId, dataToCache, cacheId) {
    this.setCachedDataItem(userId, dataToCache, cacheId)
  }
  checkCacheItemExpiration(cacheItem, userId) {
    let expiraton = false
    let currentTime = Date.now()
    if (cacheItem[userId].expiresAt < currentTime) {
      expiraton = true
    } else expiraton = false
    return expiraton
  }
  removeCacheItem(foundCache, cacheItem) {
    const cacheItemToRemove = foundCache.cachedData.findIndex((cd) => cd.userId == cacheItem.userId);
    foundCache.cachedData.splice(cacheItemToRemove, 1);
  }
  async removeAllExpiredCacheItems(cacheId) {
    const foundCache = await this.getCache(cacheId)
    if (!foundCache) {
      throw new BadRequest(`cache ${cacheId} does not exist `)
    } else {
      foundCache.cachedData.forEach(cacheItem => {
        const userId = Object.keys(cacheItem)[0]
        const expiration = this.checkCacheItemExpiration(cacheItem, userId)
        if (expiration) {
          this.removeCacheItem(foundCache, cacheItem);
        }
      });
    }
    foundCache.lastEmptied = Date.now()
    foundCache.save()
    return foundCache
  }

}
export const cacheService = new CacheService()
