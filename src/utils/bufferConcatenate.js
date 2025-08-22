/**
 * @file Utilitário para concatenação de objetos "buffer-like".
 * @author Seu Nome <seu.email@example.com>
 * @version 2.3.0
 */

/**
 * @summary Concatena dois objetos "buffer-like" em um novo ArrayBuffer.
 *
 * @description
 * Esta função une dois objetos que se comportam como buffers (ex: ArrayBuffer,
 * Node.js Buffer, Uint8Array). Ela cria um novo ArrayBuffer contendo os bytes
 * do primeiro buffer seguidos pelos bytes do segundo. A implementação é robusta,
 * segura e universalmente compatível com Node.js e navegadores.
 *
 * @param {ArrayBuffer | Buffer | Uint8Array | null} buffer1 - O primeiro objeto buffer-like.
 * @param {ArrayBuffer | Buffer | Uint8Array | null} buffer2 - O segundo objeto buffer-like.
 *
 * @returns {ArrayBuffer | null} Um novo ArrayBuffer contendo a concatenação dos dois,
 * ou `null` se alguma das entradas for `null` ou se ocorrer um erro.
 *
 * @example
 * const buf1 = new Uint8Array([1, 2]).buffer;
 * const buf2 = new Uint8Array([3, 4]);
 * const combined = bufferConcatenate(buf1, buf2); // -> Retorna ArrayBuffer com [1, 2, 3, 4]
 *
 * const invalid = bufferConcatenate(buf1, null); // -> Retorna null
 */
function bufferConcatenate(buffer1, buffer2) {
  // 1. Validação explícita para `null` ou `undefined`.
  // A verificação `== null` é uma forma concisa de tratar ambos os casos.
  if (buffer1 == null || buffer2 == null) {
    return null;
  }

  try {
    // 2. Implementação Universal com Uint8Array.
    // O construtor do `Uint8Array` lida nativamente com diversos tipos de buffer.
    const view1 = new Uint8Array(buffer1);
    const view2 = new Uint8Array(buffer2);

    // Cria uma nova visão com o tamanho combinado.
    const resultView = new Uint8Array(view1.length + view2.length);

    // Copia os bytes de forma eficiente para a nova visão.
    resultView.set(view1, 0);
    resultView.set(view2, view1.length);

    // Retorna o ArrayBuffer subjacente.
    return resultView.buffer;
  } catch (error) {
    // Captura quaisquer outros erros que possam ocorrer com tipos de entrada inesperados
    // e retorna `null` para indicar a falha.
    return null;
  }
}

// ------------------------------------------------------------------------------------------------

module.exports = bufferConcatenate;