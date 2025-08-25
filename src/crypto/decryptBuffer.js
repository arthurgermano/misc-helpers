import getCrypto from "./getCrypto";
import base64ToBuffer from "../utils/base64ToBuffer";
import importCryptoKey from "./importCryptoKey.js";

// ------------------------------------------------------------------------------------------------

/**
 * Decriptografa uma mensagem em base64 usando uma chave privada RSA.
 *
 * Esta função gerencia o fluxo de decriptografia completo: processa uma chave privada
 * em formato PEM, decodifica a mensagem criptografada de base64, importa a chave
 * para a Web Crypto API e decriptografa os dados usando o algoritmo RSA-OAEP.
 *
 * @async
 * @function decryptBuffer
 *
 * @param {string} privateKey A chave privada em formato PEM. Deve ser uma string
 * válida, incluindo os cabeçalhos `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`.
 *
 * @param {string} encryptedMessage A mensagem criptografada e codificada em base64
 * que será decriptografada.
 *
 * @param {object} [options={}] Opções para personalizar a importação da chave e a decriptografia.
 * @property {string} [options.format='pkcs8'] O formato da chave privada a ser importada.
 * O padrão 'pkcs8' é o formato mais comum.
 * @property {RsaHashedImportParams} [options.algorithm={name: 'RSA-OAEP', hash: 'SHA-256'}]
 * O algoritmo a ser usado para a importação da chave.
 * @property {boolean} [options.extractable=true] Se a chave importada pode ser exportada.
 * @property {string[]} [options.keyUsages=['decrypt']] As operações permitidas para a chave.
 * Deve incluir 'decrypt'.
 * @property {string} [options.padding='RSA-OAEP'] O esquema de preenchimento (padding)
 * usado na decriptografia. Deve ser o mesmo usado na criptografia.
 *
 * @returns {Promise<Buffer|Uint8Array>} Uma Promise que resolve para os dados
 * decriptografados como um `Buffer` (em Node.js) ou `Uint8Array` (no navegador).
 * Retorna uma string vazia se `encryptedMessage` for vazio.
 *
 * @throws {Error} Lança um erro se a chave for inválida, a mensagem estiver
 * corrompida, ou se a operação criptográfica falhar (ex: padding incorreto).
 *
 * @example
 * // Supondo que `encryptedBase64` foi gerado pela função `encryptBuffer`
 * // e `privateKeyPem` é a chave privada correspondente.
 *
 * try {
 * const decryptedBuffer = await decryptBuffer(privateKeyPem, encryptedBase64);
 *
 * // Para visualizar o resultado como texto:
 * // No Node.js:
 * // console.log('Mensagem decriptografada:', decryptedBuffer.toString('utf8'));
 *
 * // No navegador:
 * // console.log('Mensagem decriptografada:', new TextDecoder().decode(decryptedBuffer));
 * } catch (error) {
 * console.error('Falha na decriptografia:', error);
 * }
 */
async function decryptBuffer(privateKey, encryptedMessage, props = {}) {
  // Early return for empty encrypted messages
  if (!encryptedMessage) {
    // Retorna um Uint8Array vazio no navegador ou Buffer vazio no Node
    return getCrypto().subtle ? new Uint8Array(0) : Buffer.alloc(0);
  }

  // Destructure configuration with defaults
  const {
    format = "pkcs8",
    algorithm = { name: "RSA-OAEP", hash: { name: "SHA-256" } },
    extractable = true,
    keyUsages = ["decrypt"],
    padding = "RSA-OAEP"
  } = props || {};

  // Get crypto implementation
  const crypto = getCrypto();

  // Clean and convert PEM private key to binary
  const cleanedPrivateKey = privateKey.replace(
    /-----(BEGIN|END) (?:RSA )?(?:PRIVATE|PUBLIC) KEY-----|\s/g,
    ""
  );
  const binaryPrivateKey = base64ToBuffer(cleanedPrivateKey);

  // Import the private key
  const importedKey = await importCryptoKey(
    format,
    binaryPrivateKey,
    algorithm,
    extractable,
    keyUsages
  );

  // Convert base64 encrypted message to binary
  const encryptedData = base64ToBuffer(encryptedMessage);

  // Perform decryption
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: padding },
    importedKey,
    encryptedData
  );

  // Return the raw decrypted buffer
  return decryptedBuffer;
}

// ------------------------------------------------------------------------------------------------

export default decryptBuffer;