/**
 * @file Utilitário para converter um buffer (ou sua representação em string) para uma string de texto.
 */

/**
 * @summary Converte um `Uint8Array` ou uma string de bytes para uma string de texto (UTF-8).
 *
 * @description
 * Esta função tem um comportamento duplo:
 * 1. **Modo Padrão (sem `splitChar`):** Recebe um objeto buffer-like (`Uint8Array`, `Buffer`, `ArrayBuffer`)
 * e o decodifica para uma string UTF-8.
 * 2. **Modo de Análise (com `splitChar`):** Recebe uma **string** de números (representando bytes),
 * separados pelo `splitChar`. Ela irá analisar essa string, montar um `Uint8Array` e então decodificá-lo.
 *
 * @param {Uint8Array | ArrayBuffer | Buffer | string} uint8Array - O buffer a ser convertido,
 * ou a string de bytes a ser analisada.
 * @param {string} [splitChar] - Opcional. Ativa o modo de análise, usando este caractere como separador.
 *
 * @returns {string} A string decodificada.
 *
 * @example
 * // Modo Padrão (com um buffer real)
 * const bytes = new Uint8Array([72, 101, 108, 108, 111]); // Bytes para "Hello"
 * uint8ArrayToString(bytes); // Retorna "Hello"
 *
 * // Modo de Análise (com uma string de bytes)
 * const byteString = "72,101,108,108,111";
 * uint8ArrayToString(byteString, ','); // Retorna "Hello"
 */
function uint8ArrayToString(uint8Array, splitChar) {
  // 1. Validação de entrada básica.
  if (uint8Array == null) {
    return "";
  }

  let bufferSource = uint8Array;

  // 2. Verifica se está no "Modo de Análise".
  if (splitChar !== undefined && typeof uint8Array === 'string') {
    // Converte a string de números (ex: "72, 101, 108") em um array de números.
    const bytes = uint8Array.split(splitChar).map(s => parseInt(s.trim(), 10));
    // Cria o buffer a partir dos números analisados.
    bufferSource = new Uint8Array(bytes);
  }

  // 3. Decodifica o buffer para uma string UTF-8 (lógica cross-platform).
  // `bufferSource` agora é garantidamente um objeto buffer-like.
  try {
    // Ambiente Node.js:
    if (typeof window === 'undefined') {
      const nodeBuffer = Buffer.isBuffer(bufferSource) ? bufferSource : Buffer.from(bufferSource);
      return nodeBuffer.toString('utf-8');
    }

    // Ambiente do Navegador:
    return new TextDecoder().decode(bufferSource);
  } catch (error) {
    // Retorna uma string vazia se o buffer de entrada for inválido para as APIs.
    return "";
  }
}

// ------------------------------------------------------------------------------------------------

export default uint8ArrayToString;