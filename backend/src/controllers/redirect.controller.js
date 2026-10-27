const prisma = require("../prisma/client");
const redis = require("../redis/client");
const { decodeBase62 } = require("../utils/base62");

// PostgreSQL BIGINT max (2^63 - 1)
const PG_BIGINT_MAX = 9223372036854775807n;

async function redirectUrl(req, res) {
  try {
    const { shortCode } = req.params;

    // Check Redis cache (graceful — returns null if Redis is down)
    const cachedUrl = await redis.get(shortCode);
    if (cachedUrl) {
      // Async click increment (non-blocking)
      prisma.url.update({
        where: { shortCode },
        data: { clickCount: { increment: 1 } },
      }).catch(console.error);

      return res.redirect(302, cachedUrl);
    }

    // Cache MISS — DB lookup
    const id = decodeBase62(shortCode);

    // Guard: if ID exceeds PostgreSQL BIGINT max, it can't exist
    if (id > PG_BIGINT_MAX) {
      return res.status(404).send("Short URL not found");
    }

    const url = await prisma.url.findUnique({
      where: { id },
    });

    if (!url) {
      return res.status(404).send("Short URL not found");
    }

    // Store in Redis (graceful — no-ops if Redis is down)
    await redis.set(shortCode, url.originalUrl, "EX", 60 * 60);

    // Increment click count
    prisma.url.update({
      where: { shortCode },
      data: { clickCount: { increment: 1 } },
    }).catch(console.error);

    // Redirect
    return res.redirect(302, url.originalUrl);
  } catch (err) {
    // Both "invalid base62 chars" and "record not found" are 404 from the client's perspective
    return res.status(404).send("Short URL not found");
  }
}

module.exports = { redirectUrl };
