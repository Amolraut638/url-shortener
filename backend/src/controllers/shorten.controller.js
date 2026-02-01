const prisma = require("../prisma/client");
const { encodeBase62 } = require("../utils/base62");
const isValidUrl = require("../utils/validateUrl");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function shortenUrl(req, res) {
  try {
    const { url } = req.body;

    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    // Insert to get auto-increment ID
    const created = await prisma.url.create({
      data: {
        originalUrl: url,
        shortCode: "", // temporary
      },
    });

    // Base62 encode the BigInt id
    const shortCode = encodeBase62(created.id);

    // Update shortCode
    await prisma.url.update({
      where: { id: created.id },
      data: { shortCode },
    });

    return res.status(201).json({
      shortUrl: `${BASE_URL}/${shortCode}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { shortenUrl };
