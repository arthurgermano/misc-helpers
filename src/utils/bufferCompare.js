/**
 * @file Utilitário para comparação binária de ArrayBuffers.
 * @author Seu Nome <seu.email@example.com>
 * @version 2.0.0
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
  // 1. Validação de tipo: garante que ambos os argumentos são instâncias de ArrayBuffer.
  if (!(buffer1 instanceof ArrayBuffer) || !(buffer2 instanceof ArrayBuffer)) {
    return false;
  }

  // 2. Verificação de tamanho: a forma mais rápida de identificar buffers diferentes.
  // Se os tamanhos não batem, é impossível que sejam iguais.
  if (buffer1.byteLength !== buffer2.byteLength) {
    return false;
  }

  // **Otimização para ambiente Node.js:**
  if (typeof window === 'undefined') {
    // Converte os ArrayBuffers para Buffers do Node.js e usa o método `equals`,
    // que é uma implementação nativa e extremamente performática.
    const buf1 = Buffer.from(buffer1);
    const buf2 = Buffer.from(buffer2);
    return buf1.equals(buf2);
  }

  // **Otimização para ambiente do Navegador:**
  // Em vez de comparar byte a byte, compara em blocos maiores (4 bytes ou 32 bits por vez).
  const view1_32 = new Uint32Array(buffer1);
  const view2_32 = new Uint32Array(buffer2);

  // Compara a maior parte do buffer em blocos de 32 bits.
  for (let i = 0; i < view1_32.length; i++) {
    if (view1_32[i] !== view2_32[i]) {
      return false;
    }
  }

  // Calcula onde a comparação de 32 bits parou para checar os bytes restantes.
  const remainingOffset = view1_32.length * 4;

  // Compara os bytes restantes (caso o tamanho do buffer não seja múltiplo de 4).
  const view1_8 = new Uint8Array(buffer1);
  const view2_8 = new Uint8Array(buffer2);
  for (let i = remainingOffset; i < view1_8.length; i++) {
    if (view1_8[i] !== view2_8[i]) {
      return false;
    }
  }

  // Se todas as comparações passaram, os buffers são idênticos.
  return true;
}

// ------------------------------------------------------------------------------------------------

module.exports = bufferCompare;