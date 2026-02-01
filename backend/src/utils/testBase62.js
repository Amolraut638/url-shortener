const { encodeBase62, decodeBase62 } = require("./base62");

const id = 1000001n;

const shortCode = encodeBase62(id);
console.log("Encoded:", shortCode);

const decodedId = decodeBase62(shortCode);
console.log("Decoded:", decodedId.toString());
