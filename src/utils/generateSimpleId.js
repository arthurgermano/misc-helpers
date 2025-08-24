import toString from "./toString";

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para gerar um ID de string simples.
 */

/**
 * @summary Gera um ID de string simples com alta probabilidade de ser único.
 *
 * @description
 * Esta função cria um ID combinando um prefixo opcional, o timestamp atual em
 * milissegundos, e uma sequência de bytes aleatórios e criptograficamente seguros
 * convertidos para hexadecimal.
 *
 * O formato do ID resultante é: `[prefixo<separador>]<timestamp><separador><bytesAleatoriosHex>`
 *
 * A utilização de `crypto.getRandomValues` torna a parte aleatória do ID muito menos
 * previsível do que `Math.random()`, aumentando a resistência a colisões.
 *
 * @param {string | number} [id] - Um prefixo opcional para o ID. Será convertido para string.
 * @param {string} [separator="_"] - O separador a ser usado entre as partes do ID.
 *
 * @returns {string} O novo ID de string gerado.
 *
 * @example
 * // Gera um ID com o prefixo "user"
 * // Exemplo de saída: "user_1724276767000_a1b2c3d4e5f6"
 * const userId = generateSimpleId("user");
 *
 * // Gera um ID sem prefixo
 * // Exemplo de saída: "1724276767000_a1b2c3d4e5f6"
 * const eventId = generateSimpleId();
 */
function generateSimpleId(id, separator = "_") {
  // 1. Gera a parte aleatória do ID de forma segura.
  // Cria um array de 6 bytes, que resultará em 12 caracteres hexadecimais.
  const randomBytes = new Uint8Array(6);
  globalThis.crypto.getRandomValues(randomBytes);

  // Converte os bytes para uma string hexadecimal, garantindo que cada byte seja representado por 2 caracteres.
  const randomHex = Array.from(randomBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

  // 2. Constrói as partes do ID em um array para maior clareza.
  const parts = [];
  const idString = toString(id);

  // Adiciona o prefixo apenas se ele for fornecido e não for uma string vazia.
  if (idString) {
    parts.push(idString);
  }

  // Adiciona o timestamp e a parte aleatória segura.
  parts.push(Date.now());
  parts.push(randomHex);

  // 3. Junta as partes com o separador e retorna o ID final.
  return parts.join(separator);
}

// ------------------------------------------------------------------------------------------------

export default generateSimpleId;