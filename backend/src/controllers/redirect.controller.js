const prisma = require("../prisma/client");
const redis = require("../redis/client");
const { decodeBase62 } = require("../utils/base62");

async function redirectUrl(req, res) {
  try {
    const { shortCode } = req.params;

    // Check Redis cache
    const cachedUrl = await redis.get(shortCode);
    if (cachedUrl) {
      // async click increment (non-blocking)
      prisma.url.update({
        where: { shortCode },
        data: { clickCount: { increment: 1 } },
      }).catch(console.error);

      return res.redirect(302, cachedUrl);
    }

    //  Cache MISS → DB lookup
    const id = decodeBase62(shortCode);

    const url = await prisma.url.findUnique({
      where: { id },
    });

    if (!url) {
      return res.status(404).send("Short URL not found");
    }

    // Store in Redis (TTL optional)
    await redis.set(shortCode, url.originalUrl, "EX", 60 * 60); // 1 hour

    // Increment click count
    prisma.url.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
    }).catch(console.error);

    // Redirect
    return res.redirect(302, url.originalUrl);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Invalid short URL");
  }
}

module.exports = { redirectUrl };
