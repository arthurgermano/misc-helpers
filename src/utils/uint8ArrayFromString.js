/**
 * @file Utilitário cross-platform para converter strings UTF-8 para Uint8Array.
 * @author Seu Nome <seu.email@example.com>
 * @version 2.1.0
 */

/**
 * @summary Converte uma string (UTF-8) para um `Uint8Array` ou uma string de bytes.
 *
 * @description
 * Esta função converte uma string para sua representação binária como um `Uint8Array` em
 * formato UTF-8. Opcionalmente, se um caractere de junção (`joinChar`) for fornecido,
 * a função retornará uma string com os valores dos bytes unidos por esse caractere.
 * A conversão para bytes é cross-platform e lida corretamente com caracteres multi-byte.
 *
 * @param {string} [text=""] - A string a ser convertida.
 * @param {string} [joinChar] - Opcional. Se fornecido, a função retorna uma string dos valores
 * dos bytes em vez de um `Uint8Array`.
 *
 * @returns {Uint8Array | string} Um `Uint8Array` com os bytes da string, ou uma `string`
 * formatada se `joinChar` for especificado.
 *
 * @example
 * // Retornando um Uint8Array
 * const bytes = uint8ArrayFromString('Hi');
 * console.log(bytes); // Uint8Array(2) [ 72, 105 ]
 *
 * // Retornando uma string formatada
 * const byteString = uint8ArrayFromString('Hi', '-');
 * console.log(byteString); // "72-105"
 */
function uint8ArrayFromString(text = "", joinChar) {
  // 1. Validação de tipo.
  if (typeof text !== 'string') {
    // Retorna um tipo consistente com o caminho de sucesso (string vazia ou array vazio).
    return joinChar !== undefined ? '' : new Uint8Array();
  }

  let uint8Array;

  // **Ambiente Node.js:**
  if (typeof window === 'undefined') {
    // `Buffer.from` cria um Buffer (que é um Uint8Array) a partir da string UTF-8.
    uint8Array = Buffer.from(text, 'utf-8');
  } else {
    // **Ambiente do Navegador:**
    // `TextEncoder` é a API padrão para converter strings em bytes UTF-8.
    uint8Array = new TextEncoder().encode(text);
  }

  // 3. Decide o formato de saída com base na presença de `joinChar`.
  if (joinChar !== undefined) {
    // `Uint8Array` não possui o método `.join`, então é necessário converter
    // para um array padrão antes de fazer a junção.
    return Array.from(uint8Array).join(joinChar);
  }

  // Retorna o Uint8Array se nenhum `joinChar` for especificado.
  return uint8Array;
}

// ------------------------------------------------------------------------------------------------

module.exports = uint8ArrayFromString;