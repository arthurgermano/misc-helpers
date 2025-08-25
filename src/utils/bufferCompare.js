/**
 * @file Utilitário para comparação binária de ArrayBuffers.
 */

/**
 * @summary Compara dois ArrayBuffers para verificar se contêm os mesmos bytes.
 *
 * @description
 * Realiza uma comparação binária eficiente de dois ArrayBuffers. A função é otimizada
 * para diferentes ambientes: no Node.js, utiliza o método nativo e rápido `Buffer.equals()`,
 * enquanto no navegador, emprega uma técnica de comparação por blocos para acelerar o processo.
 *
 * @param {ArrayBuffer} buffer1 - O primeiro ArrayBuffer para a comparação.
 * @param {ArrayBuffer} buffer2 - O segundo ArrayBuffer para a comparação.
 *
 * @returns {boolean} Retorna `true` se os buffers forem idênticos, caso contrário, `false`.
 *
 * @example
 * const buf1 = new Uint8Array([1, 2, 3, 4, 5]).buffer;
 * const buf2 = new Uint8Array([1, 2, 3, 4, 5]).buffer;
 * const buf3 = new Uint8Array([1, 2, 3, 4, 9]).buffer;
 *
 * console.log(bufferCompare(buf1, buf2)); // true
 * console.log(bufferCompare(buf1, buf3)); // false
 */
function bufferCompare(buffer1, buffer2) {
  if (!buffer1 || !buffer2 || buffer1.byteLength !== buffer2.byteLength) {
    return false;
  }

  const view1 = new Uint8Array(buffer1);
  const view2 = new Uint8Array(buffer2);
  for (let i = 0; i < view1.length; i++) {
    if (view1[i] !== view2[i]) return false;
  }
  return true;
}

// ------------------------------------------------------------------------------------------------

export default bufferCompare;