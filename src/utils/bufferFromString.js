/**
 * @file Utilitário para converter uma string para um buffer de bytes.
 * @author Seu Nome <seu.email@example.com>
 * @version 2.0.0
 */

/**
 * @summary Converte uma string para um buffer de bytes (`Uint8Array`).
 *
 * @description
 * Esta função converte uma string de texto para sua representação binária, retornando um `Uint8Array`.
 * A função é universalmente compatível, usando `Buffer` no Node.js e `TextEncoder` no navegador.
 *
 * O objeto `Buffer` do Node.js é uma subclasse de `Uint8Array`, então o tipo de retorno
 * é consistente e interoperável entre os dois ambientes.
 *
 * @param {string} txtString - A string a ser convertida para um buffer.
 * @param {BufferEncoding} [encoding="utf-8"] - **(Apenas Node.js)** A codificação a ser usada.
 * **No ambiente do navegador, este parâmetro é ignorado e a codificação será sempre UTF-8**,
 * devido a limitações da API `TextEncoder`.
 *
 * @returns {Uint8Array | null} Um `Uint8Array` representando os bytes da string.
 * Retorna `null` se a entrada não for uma string.
 *
 * @example
 * const buffer = bufferFromString('Olá, Mundo! 👋');
 *
 * // `buffer` será um `Buffer` no Node.js e um `Uint8Array` no navegador,
 * // mas ambos se comportam como um Uint8Array.
 * console.log(buffer.length); // 17
 * console.log(buffer[0]); // 79 ('O')
 * console.log(buffer[12]); // 240 (primeiro byte do emoji 👋)
 */
function bufferFromString(txtString, encoding = "utf-8") {
  // 1. Validação de tipo: garante que a entrada é uma string.
  if (typeof txtString !== 'string') {
    return null;
  }

  // **Ambiente Node.js:**
  if (typeof window === 'undefined') {
    // `Buffer.from` é a forma otimizada de criar um buffer no Node.js e
    // respeita o parâmetro `encoding`. O Buffer resultante já é uma instância de Uint8Array.
    return Buffer.from(txtString, encoding);
  }

  // **Ambiente do Navegador:**
  // `TextEncoder` é a API padrão da web para converter strings em bytes.
  // O método `.encode()` retorna diretamente um `Uint8Array`.
  return new TextEncoder().encode(txtString);
}

// ------------------------------------------------------------------------------------------------

module.exports = bufferFromString;