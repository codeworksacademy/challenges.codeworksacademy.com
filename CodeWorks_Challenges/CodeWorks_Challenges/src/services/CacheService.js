import { dbContext } from "../db/DbContext.js"
import { BadRequest } from "../utils/Errors.js";
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
    const cache = await this.getCache(cacheId)
    this.setCachedDataItem(userId, dataToCache, cache)
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
