import { dbContext } from "../db/DbContext.js"
class CacheService {
  async getOrCreateCache(cacheId) {
    let foundCache = await dbContext.Cache.findOne({ cacheId });

    if (!foundCache) {
      foundCache = await this.createCache(cacheId);
    }

    return foundCache
  }

  async createCache(cacheId) {
    const initializeCache = {};
    initializeCache.cacheId = cacheId;
    initializeCache.cachedData = [];
    return await dbContext.Cache.create(initializeCache);
  }

  getCacheItem(userId, accountMilestoneCache) {
    const cacheItem = accountMilestoneCache.cachedData.find((cd) => userId in cd)
    return cacheItem
  }
  async setCachedDataItem(userId, dataToCache, cache) {
    const expiresAt = Date.now() + 300000 // 5 Minutes
    const dataToPush = { [userId]: { dataToCache, expiresAt } }
    cache.cachedData.push(dataToPush)
    await cache.save()
    return cache.cachedData[userId]
  }
  checkCacheItemExpiration(cacheItem, userId) {
    let expiraton = false
    let currentTime = Date.now()
    if (cacheItem[userId].expiresAt < currentTime) {
      expiraton = true
    } else expiraton = false
    return expiraton
  }
  async removeExpiredCacheItem(cacheItem, cache) {
    const foundCache = await this.getOrCreateCache(cache.cacheId)
    const cacheItemToRemove = foundCache.cachedData.findIndex((cd) => cd.userId == cacheItem.userId)
    foundCache.cachedData.splice(cacheItemToRemove, 1)
  }
}
export const cacheService = new CacheService()
