const prisma = require("../prisma/client");
const { decodeBase62 } = require("../utils/base62");

async function getUrlStats(req, res) {
  try {
    const { shortCode } = req.params;

    // Decode shortCode - numeric ID
    const id = decodeBase62(shortCode);

    const url = await prisma.url.findUnique({
      where: { id },
      select: {
        originalUrl: true,
        clickCount: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    if (!url) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    return res.json({
      shortCode,
      originalUrl: url.originalUrl,
      clickCount: url.clickCount,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Invalid short code" });
  }
}

module.exports = { getUrlStats };
