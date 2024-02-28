import { Query } from "mongoose"
import { logger } from "./Logger.js"

export class SimpleCache {

  ttlSeconds = 60
  #cache = {}

  constructor(ttl = 60) {
    this.ttlSeconds = ttl
  }


  clearCache() {
    this.#cache = {}
  }

  clearKey(key) {
    delete this.#cache[key]
  }

  /**
   * 
   * @param {string} key 
   * @param {any} cb 
   * @returns 
   */
  async getEntry(key, cb) {
    if (this.#cache[key] && this.#cache[key].expires > Date.now() && this.#cache[key].value) {
      // logger.log("existing cache: [key]", this.#cache[key]);
      return Promise.resolve(this.#cache[key].value)
    }

    this.#cache[key] = { expires: Date.now() + (1000 * this.ttlSeconds), value: null }
    this.#cache[key].value = await cb()
    // logger.log("new key cached: [key]", this.#cache[key]);
    return this.#cache[key].value
  }
}