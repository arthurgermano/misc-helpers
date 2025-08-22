const { decompressSync, strFromU8 } = require("fflate");

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário cross-platform e performático para descompressão de strings.
 * @author Seu Nome <seu.email@example.com>
 * @version 3.0.0
 */

/**
 * @typedef {object} DecompressionOptions - Opções para a função de descompressão.
 * @property {'base64' | 'buffer'} [inputType='base64'] - O formato da entrada de dados comprimidos.
 */

/**
 * @summary Descomprime dados (Base64 ou buffer) de volta para a string original.
 *
 * @description
 * Esta função síncrona é a contraparte da `stringCompress`. Ela recebe dados comprimidos,
 * seja como uma string Base64 ou um `Uint8Array`, e os descomprime para a string de
 * texto original em formato UTF-8, utilizando a biblioteca `fflate`.
 *
 * @param {string | Uint8Array} compressedData - Os dados comprimidos a serem descomprimidos.
 * @param {DecompressionOptions} [options={}] - Opções para customizar o tipo de entrada.
 *
 * @returns {string} A string original descomprimida. Retorna uma string vazia se a
 * entrada for inválida ou se a descompressão falhar (ex: dados corrompidos).
 *
 * @example
 * const textoOriginal = 'O texto original que será comprimido e depois descomprimido.';
 *
 * // 1. Comprime para Base64
 * const comprimidoB64 = stringCompress(textoOriginal);
 *
 * // 2. Descomprime de volta para o original
 * const descomprimido = stringDecompress(comprimidoB64);
 *
 * console.log(descomprimido === textoOriginal); // true
 */
function stringDecompress(compressedData, options = {}) {
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
      // Garante que a entrada é uma string antes de tentar decodificar.
      if (typeof compressedData !== 'string') {
        return "";
      }
      
      // A decodificação de Base64 para binário é feita de forma otimizada para cada ambiente.
      if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
        // **Ambiente Node.js:**
        // `Buffer.from` lida com Base64 nativamente e é muito rápido.
        inputBuffer = Buffer.from(compressedData, 'base64');
      } else {
        // **Ambiente do Navegador:**
        // Usa `atob` para decodificar para uma "binary string" e então converte para Uint8Array.
        const binaryString = atob(compressedData);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        inputBuffer = bytes;
      }
    } else {
      // Se o tipo for 'buffer', assume que a entrada já está em um formato binário compatível.
      inputBuffer = compressedData;
    }

    // Valida se a conversão ou a entrada resultou em um buffer com conteúdo.
    if (!inputBuffer || inputBuffer.byteLength === 0) {
      return "";
    }

    // 4. Descomprime o buffer. Esta operação pode falhar se os dados estiverem corrompidos.
    const decompressedBuffer = decompressSync(inputBuffer);

    // 5. Converte o buffer descomprimido de volta para uma string UTF-8.
    return strFromU8(decompressedBuffer);
  } catch (error) {
    // Retorna uma string vazia se a descompressão falhar (ex: dados corrompidos ou Base64 inválido).
    return "";
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = stringDecompress;