import getCrypto from "./getCrypto.js";
import decrypt from "./decrypt.js";
import encrypt from "./encrypt.js";
import digest from "./digest.js";
import importCryptoKey from "./importCryptoKey.js";
import verifySignature from "./verifySignature.js";

// Named exports para importação individual
export {
  getCrypto,
  decrypt,
  encrypt,
  digest,
  importCryptoKey,
  verifySignature
};

// Default export para compatibilidade
export default {
  getCrypto,
  decrypt,
  encrypt,
  digest,
  importCryptoKey,
  verifySignature,
};