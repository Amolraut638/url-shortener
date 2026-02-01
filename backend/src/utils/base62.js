const BASE62_CHARS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Encode number - Base62 string
function encodeBase62(num) {
  if (num === 0n) 
    return BASE62_CHARS[0];

  let base62 = "";
  const base = 62n;

  while (num > 0n) {
    const remainder = num % base;
    base62 = BASE62_CHARS[Number(remainder)] + base62;
    num = num / base;
  }

  return base62;
}

// Decode Base62 string - number
function decodeBase62(str) {
  let num = 0n;
  const base = 62n;

  for (const char of str) {
    const value = BASE62_CHARS.indexOf(char);
    if (value === -1) {
      throw new Error("Invalid Base62 character");
    }
    num = num * base + BigInt(value);  // BigInt is used for safely encode largely auto increment ID's
  }

  return num;
}

module.exports = {
  encodeBase62,
  decodeBase62,
};
