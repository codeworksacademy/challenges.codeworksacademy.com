
export class EZCache {
  constructor(data) {
    this.cacheId = data.cacheId
    this.cachedData = data.cachedData
    this.lastEmptied = Date.now()
  }
}