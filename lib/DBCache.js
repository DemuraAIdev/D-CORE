class DBcache {
  /**
   * DBcache
   */
  constructor() {
    this.cache = new Map();
  }
  async set(key, value) {
    await this.cache.set(key, value);
    return true;
  }
  get(key) {
    if (!key) return undefined;
    return this.cache.get(key);
  }

  delete(key) {
    this.cache.delete(key);
  }
  values() {
    return this.cache.values();
  }
  clear() {
    return this.cache.clear();
  }
  keys() {
    return this.cache.keys();
  }
  has(key) {
    return this.cache.has(key);
  }

  get size() {
    return this.cache.size;
  }

  get getALL() {
    return this.cache;
  }
}
module.exports = DBcache;
