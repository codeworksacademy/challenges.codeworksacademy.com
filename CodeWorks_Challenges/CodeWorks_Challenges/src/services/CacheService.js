import { EZCache } from "../models/EZCache.js";
import { BadRequest } from "../utils/Errors.js";

// /**
//  * @typedef {import('../models/EZCache.js').EZCache} CacheItem
//  */

// /** @type {CacheItem[]} */
const cacheEZ = [] // I named this cacheEZ because I was worried cache was reserved - Cache is

class CacheService {

  checkCache(accountId, userId, cacheId) {
    const cache = this.getOrCreateCache(cacheId);
    const response = {}
    response.cacheItem = this.getCacheItem(userId, cache);
    if (accountId != userId) {
      if (!response.cacheItem) {
        response.status = 'notFound'
      }
      if (response.cacheItem) {
        let expiration = this.checkCacheItemExpiration(response.cacheItem, userId);
        if (expiration) {
          response.status = 'expired'
        }
      }
    } else {
      response.status = 'ownedByUser'
    }
    return response;
  }

  getOrCreateCache(cacheId) {
    let foundCache = this.getCache(cacheId)

    if (!foundCache) {
      foundCache = this.createCache(cacheId);
    } else {
      const threeHoursAgo = Date.now() - 1.08e+7
      if (threeHoursAgo > foundCache.lastEmptied) {
        foundCache = this.removeAllExpiredCacheItems(cacheId)
      }
    }

    return foundCache
  }

  getCache(cacheId) {

    const foundCache = cacheEZ.find(c => c.cacheId == cacheId)
    return foundCache
  }

  createCache(cacheId) {
    const initializeCache = {};
    initializeCache.cacheId = cacheId;
    initializeCache.cachedData = [];
    const cacheItem = new EZCache(initializeCache)
    cacheEZ.push(cacheItem)
    return cacheItem
  }

  getCacheItem(userId, cache) {
    const cacheItem = cache.cachedData.find((cd) => userId in cd)
    return cacheItem
  }
  setCachedDataItem(userId, dataToCache, cacheId) {
    const cache = this.getCache(cacheId)
    const expiresAt = Date.now() + 300000 // 5 Minutes
    const cacheItem = this.getCacheItem(userId, cache)
    if (!cacheItem) {
      const dataToPush = { [userId]: { dataToCache, expiresAt } }
      cache.cachedData.push(dataToPush)
    } else {
      cacheItem[userId][dataToCache] = dataToCache;
      cacheItem[userId].expiresAt = expiresAt;
    }
    return cache.cachedData[userId]
  }

  forceCacheItemUpdate(userId, dataToCache, cacheId) {
    this.setCachedDataItem(userId, dataToCache, cacheId)
  }
  checkCacheItemExpiration(cacheItem, userId) {
    let expiration = false
    let currentTime = Date.now()
    if (cacheItem[userId].expiresAt < currentTime) {
      expiration = true
    } else expiration = false
    return expiration
  }
  removeCacheItem(foundCache, cacheItem) {
    const cacheItemToRemove = foundCache.cachedData.findIndex((cd) => cd.userId == cacheItem.userId);
    foundCache.cachedData.splice(cacheItemToRemove, 1);
  }
  removeAllExpiredCacheItems(cacheId) {
    const foundCache = this.getCache(cacheId)
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
    return foundCache
  }

}
export const cacheService = new CacheService()
