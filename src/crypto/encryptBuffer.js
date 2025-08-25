import getCrypto from "./getCrypto.js";
import base64FromBuffer from "../utils/base64FromBuffer.js";
import importCryptoKey from "./importCryptoKey.js";
import base64ToBuffer from "../utils/base64ToBuffer.js";

// ------------------------------------------------------------------------------------------------

/**
 * Criptografa dados binários (Buffer/Uint8Array) usando uma chave pública RSA.
 *
 * Esta função gerencia o fluxo de criptografia completo: processa uma chave pública
 * em formato PEM, importa-a para a Web Crypto API e criptografa os dados usando
 * o algoritmo RSA-OAEP, que é o padrão da indústria para preenchimento (padding).
 *
 * @async
 * @function encryptBuffer
 *
 * @param {string} publicKey A chave pública em formato PEM. Deve ser uma string
 * válida, incluindo os cabeçalhos `-----BEGIN PUBLIC KEY-----` e `-----END PUBLIC KEY-----`.
 *
 * @param {Buffer|Uint8Array} messageBuffer Os dados binários a serem criptografados.
 * - Em Node.js, pode ser um `Buffer`.
 * - No navegador, pode ser um `Uint8Array`.
 * - O tamanho máximo dos dados é limitado pelo tamanho da chave e pelo esquema de
 * padding. Por exemplo:
 * - Chave de 2048 bits (RSA-OAEP): ~190 bytes.
 * - Chave de 4096 bits (RSA-OAEP): ~446 bytes.
 *
 * @param {object} [options={}] Opções para personalizar a importação da chave e a criptografia.
 * @property {string} [options.format='spki'] O formato da chave a ser importada.
 * Valores comuns são 'spki' (padrão) ou 'jwk'.
 * @property {RsaHashedImportParams} [options.algorithm={name: 'RSA-OAEP', hash: 'SHA-256'}]
 * O algoritmo a ser usado para a importação da chave.
 * @property {boolean} [options.extractable=true] Se a chave importada pode ser exportada.
 * @property {string[]} [options.keyUsages=['encrypt']] As operações permitidas para a chave.
 * Deve incluir 'encrypt'.
 * @property {string} [options.padding='RSA-OAEP'] O esquema de preenchimento (padding) a ser
 * usado na criptografia.
 *
 * @returns {Promise<string>} Uma Promise que resolve para uma string codificada em base64
 * contendo os dados criptografados. Retorna uma string vazia se `messageBuffer` for vazio.
 *
 * @throws {Error} Lança um erro se a chave for inválida, a mensagem exceder o
 * limite de tamanho para a chave, ou se a operação criptográfica falhar.
 *
 * @example
 * // Exemplo de uso para criptografar uma mensagem
 * const publicKeyPem = `-----BEGIN PUBLIC KEY-----
 * MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
 * -----END PUBLIC KEY-----`;
 *
 * // No Node.js:
 * // const buffer = Buffer.from('Hello, World!');
 *
 * // No navegador:
 * // const buffer = new TextEncoder().encode('Hello, World!');
 *
 * try {
 * const encrypted = await encryptBuffer(publicKeyPem, buffer);
 * console.log('Dados criptografados (base64):', encrypted);
 * } catch (error) {
 * console.error('Falha na criptografia:', error);
 * }
 */
async function encryptBuffer(publicKey, messageBuffer, props = {}) {
  // Handle empty buffer case early for performance
  if (!messageBuffer || messageBuffer.length === 0) return "";

  // Extract crypto module for the current environment
  const crypto = getCrypto();

  // Clean and convert PEM-formatted public key to binary format
  const cleanedPublicKey = publicKey.replace(
    /(-----(BEGIN|END) (RSA )?(PRIVATE|PUBLIC) KEY-----|\s)/g,
    ""
  );
  const binaryPublicKey = base64ToBuffer(cleanedPublicKey);

  // Destructure configuration with defaults
  const {
    format = "spki",
    algorithm = { name: "RSA-OAEP", hash: { name: "SHA-256" } },
    extractable = true,
    keyUsages = ["encrypt"],
    padding = "RSA-OAEP",
  } = props || {};

  // Import the public key into Web Crypto API format
  const importedKey = await importCryptoKey(
    format || "spki",
    binaryPublicKey,
    algorithm || {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    extractable !== undefined ? extractable : true,
    keyUsages || ["encrypt"]
  );

  // Perform the actual encryption operation using the imported key
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: padding || "RSA-OAEP" },
    importedKey,
    messageBuffer
  );

  // Convert encrypted binary data to base64 for safe text transmission
  return base64FromBuffer(encryptedBuffer);
}

// ------------------------------------------------------------------------------------------------

// Export for CommonJS compatibility (Node.js)
export default encryptBuffer;
