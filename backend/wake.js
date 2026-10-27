require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.$queryRaw`SELECT 1`
  .then(() => { console.log("✅ Neon DB is awake"); p.$disconnect(); })
  .catch(e => { console.error("❌ DB error:", e.message); p.$disconnect(); process.exit(1); });
