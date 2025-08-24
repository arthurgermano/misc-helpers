/**
 * @file Utilitário para calcular timestamps baseados em segundos.
 */

/**
 * @summary Calcula um timestamp futuro ou passado a partir do tempo atual.
 *
 * @description
 * Esta função adiciona ou subtrai um determinado número de segundos do tempo atual
 * (`Date.now()`) e retorna o resultado como um timestamp numérico (milissegundos
 * desde a Época Unix). A operação é puramente aritmética, garantindo alta performance.
 *
 * @param {number} seconds - O número de segundos a ser adicionado ou subtraído.
 * Deve ser um número finito.
 * @param {boolean} [add=true] - Determina a operação. Se `true`, os segundos são
 * adicionados (calculando um tempo futuro). Se `false`, são subtraídos
 * (calculando um tempo passado).
 *
 * @returns {number | null} O timestamp calculado em milissegundos, ou `null` se
 * o valor de `seconds` for inválido.
 *
 * @example
 * // Calcula o timestamp para 5 minutos (300 segundos) no futuro
 * const fiveMinutesFromNow = calculateSecondsInTime(300);
 * console.log(`Timestamp em 5 minutos: ${fiveMinutesFromNow}`);
 *
 * // Calcula o timestamp para 1 hora (3600 segundos) no passado
 * const oneHourAgo = calculateSecondsInTime(3600, false);
 * console.log(`Timestamp de 1 hora atrás: ${oneHourAgo}`);
 */
function calculateSecondsInTime(seconds, add = true) {
  // 1. Validação: garante que `seconds` é um número válido e finito.
  // `isFinite` trata casos como `Infinity`, `-Infinity` e `NaN`.
  if (typeof seconds !== 'number' || !isFinite(seconds)) {
    return null;
  }

  // 2. Converte a entrada de segundos para milissegundos.
  const offsetInMilliseconds = seconds * 1000;

  // 3. Aplica a operação e retorna o timestamp final.
  // Esta abordagem é mais direta e performática do que criar um novo objeto `Date`.
  if (add) {
    return Date.now() + offsetInMilliseconds;
  }

  return Date.now() - offsetInMilliseconds;
}

// ------------------------------------------------------------------------------------------------

export default calculateSecondsInTime;