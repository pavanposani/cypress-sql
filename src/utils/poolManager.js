// pool-manager.js
const mssql = require('mssql')
const pools = new Map();

module.exports = {
 /**
  * Get or create a pool. If a pool doesn't exist the config must be provided.
  * If the pool does exist the config is ignored (even if it was different to the one provided
  * when creating the pool)
  *
  * @param {string} name
  * @param {{}} [config]
  * @return {Promise.<mssql.ConnectionPool>}
  */
 connect: (config) => {
  if (!pools.has(config)) {
   if (!config) {
    throw new Error('Pool does not exist');
   }
   const pool = new mssql.ConnectionPool(config);
   // automatically remove the pool from the cache if `pool.close()` is called
   const close = pool.close.bind(pool);
   pool.close = (...args) => {
    pools.delete(config);
    return close(...args);
   }
   pools.set(config, pool.connect());
  }
  return pools.get(config);
 },
 /**
  * Closes all the pools and removes them from the store
  *
  * @return {Promise<mssql.ConnectionPool[]>}
  */
 closeAll: () => Promise.all(Array.from(pools.values()).map((connect) => {
  return connect.then((pool) => pool.close());
 })),
};