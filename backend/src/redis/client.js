const { Redis } = require("@upstash/redis");

let redis = null;

// Initialise Upstash Redis using REST credentials
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    console.log("✅ Upstash Redis client initialised");
  } catch (err) {
    console.warn("⚠️  Failed to initialise Redis client:", err.message);
    redis = null;
  }
} else {
  console.warn("⚠️  UPSTASH_REDIS_REST_URL / TOKEN not set — Redis caching disabled.");
}

/**
 * Get a cached value. Returns null if Redis is unavailable or key doesn't exist.
 */
async function get(key) {
  if (!redis) return null;
  try {
    return await redis.get(key);
  } catch (err) {
    console.error("Redis GET error:", err.message);
    return null;
  }
}

/**
 * Set a cached value with optional TTL in seconds.
 * @param {string} key
 * @param {string} value
 * @param {"EX"} [exMode]
 * @param {number} [ttl]
 */
async function set(key, value, exMode, ttl) {
  if (!redis) return;
  try {
    if (exMode === "EX" && ttl) {
      await redis.set(key, value, { ex: ttl });
    } else {
      await redis.set(key, value);
    }
  } catch (err) {
    console.error("Redis SET error:", err.message);
    // Silently ignore — caching is best-effort
  }
}

module.exports = { get, set };
