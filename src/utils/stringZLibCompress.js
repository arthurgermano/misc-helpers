const { zlibSync, strToU8 } = require("fflate");

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário cross-platform para compressão de strings com Zlib.
 * @author Seu Nome <seu.email@example.com>
 * @version 1.0.0
 */

/**
 * @typedef {object} ZlibOptions - Opções para a função de compressão Zlib.
 * @property {'base64' | 'buffer'} [outputType='base64'] - O formato da saída. 'base64' para uma string ou 'buffer' para um Uint8Array.
 * @property {number} [level=6] - O nível de compressão (0-9). Níveis mais altos são mais lentos mas podem gerar saídas menores.
 * @property {number} [mem=8] - O nível de uso de memória (1-12). Níveis mais altos são mais rápidos e podem comprimir melhor, mas usam mais memória.
 */

/**
 * @summary Comprime uma string usando o algoritmo Zlib.
 *
 * @description
 * Esta função síncrona recebe uma string, a converte para bytes em UTF-8 e a comprime
 * de forma eficiente usando o formato Zlib da biblioteca `fflate`. O resultado é retornado no formato
 * especificado pelo `outputType`: uma string Base64 ou um `Uint8Array`.
 *
 * @param {string} text - A string a ser comprimida.
 * @param {ZlibOptions} [options={}] - Opções para customizar a compressão e o formato de saída.
 *
 * @returns {string | Uint8Array} A string comprimida em Base64 ou o `Uint8Array` dos dados comprimidos.
 * Retorna um valor vazio apropriado (string ou Uint8Array) para entradas inválidas.
 *
 * @example
 * const textoOriginal = 'Este texto será comprimido com o algoritmo Zlib.';
 *
 * // Comprimir para Base64 (padrão)
 * const comprimidoB64 = stringZLibCompress(textoOriginal);
 *
 * // Comprimir para um buffer binário com nível de compressão máximo
 * const comprimidoBuffer = stringZLibCompress(textoOriginal, { outputType: 'buffer', level: 9 });
 */
function stringZLibCompress(text, options = {}) {
  // 1. Define as opções padrão e as mescla com as fornecidas pelo usuário.
  const finalOptions = {
    outputType: 'base64',
    level: 6,
    mem: 8,
    ...options
  };

  // 2. Valida a entrada.
  if (typeof text !== 'string' || text.length === 0) {
    // Retorna um valor vazio do tipo de saída esperado para manter a consistência.
    return finalOptions.outputType === 'buffer' ? new Uint8Array() : "";
  }

  // 3. Converte a string de entrada para um buffer de bytes UTF-8.
  const inputBuffer = strToU8(text);

  // 4. Comprime o buffer usando as opções especificadas.
  const compressedBuffer = zlibSync(inputBuffer, {
    level: finalOptions.level,
    mem: finalOptions.mem,
  });

  // 5. Retorna o resultado no formato solicitado.
  if (finalOptions.outputType === 'buffer') {
    return compressedBuffer;
  }

  // Por padrão, retorna em Base64, com a conversão otimizada para cada ambiente.
  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
    // **Ambiente Node.js:**
    // Converte o Uint8Array para um Buffer e então para Base64. É o método mais rápido.
    return Buffer.from(compressedBuffer).toString('base64');
  } else {
    // **Ambiente do Navegador:**
    // Converte o Uint8Array para uma "binary string" e usa a função nativa `btoa`.
    let binary = '';
    const len = compressedBuffer.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(compressedBuffer[i]);
    }
    return btoa(binary);
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = stringZLibCompress;