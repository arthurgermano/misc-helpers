const { unzlibSync, strFromU8 } = require("fflate");

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário cross-platform para descompressão de strings com Zlib.
 * @author Seu Nome <seu.email@example.com>
 * @version 1.0.0
 */

/**
 * @typedef {object} ZlibDecompressionOptions - Opções para a função de descompressão Zlib.
 * @property {'base64' | 'buffer'} [inputType='base64'] - O formato da entrada de dados comprimidos.
 */

/**
 * @summary Descomprime dados (Base64 ou buffer) usando Zlib de volta para a string original.
 *
 * @description
 * Esta função síncrona é a contraparte da `stringZLibCompress`. Ela recebe dados comprimidos
 * no formato Zlib, seja como uma string Base64 ou um `Uint8Array`, e os descomprime
 * para a string de texto original em formato UTF-8.
 *
 * @param {string | Uint8Array} compressedData - Os dados comprimidos a serem descomprimidos.
 * @param {ZlibDecompressionOptions} [options={}] - Opções para customizar o tipo de entrada.
 *
 * @returns {string} A string original descomprimida. Retorna uma string vazia se a
 * entrada for inválida ou se a descompressão falhar (ex: dados corrompidos).
 *
 * @example
 * const textoOriginal = 'Este texto será comprimido e depois descomprimido com Zlib.';
 *
 * // 1. Comprime para Base64
 * const comprimidoB64 = stringZLibCompress(textoOriginal);
 *
 * // 2. Descomprime de volta para o original
 * const descomprimido = stringZLibDecompress(comprimidoB64);
 *
 * console.log(descomprimido === textoOriginal); // true
 */
function stringZLibDecompress(compressedData, options = {}) {
  // 1. Define as opções padrão e as mescla com as fornecidas pelo usuário.
  const finalOptions = {
    inputType: 'base64',
    ...options
  };

  // 2. Valida a entrada principal.
  if (!compressedData) {
    return "";
  }

  try {
    let inputBuffer;

    // 3. Normaliza a entrada para um formato de buffer binário (`Uint8Array`).
    if (finalOptions.inputType === 'base64') {
      if (typeof compressedData !== 'string') {
        return "";
      }
      
      // A decodificação de Base64 para binário é otimizada para cada ambiente.
      if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
        // **Ambiente Node.js:**
        inputBuffer = Buffer.from(compressedData, 'base64');
      } else {
        // **Ambiente do Navegador:**
        const binaryString = atob(compressedData);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        inputBuffer = bytes;
      }
    } else {
      // Se o tipo for 'buffer', assume que a entrada já está em um formato binário.
      inputBuffer = compressedData;
    }

    if (!inputBuffer || inputBuffer.byteLength === 0) {
      return "";
    }

    // 4. Descomprime o buffer. Pode falhar se os dados estiverem corrompidos.
    const decompressedBuffer = unzlibSync(inputBuffer);

    // 5. Converte o buffer descomprimido de volta para uma string UTF-8.
    return strFromU8(decompressedBuffer);
  } catch (error) {
    // Retorna uma string vazia se a descompressão falhar.
    return "";
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = stringZLibDecompress;