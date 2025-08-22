/**
 * @file Utilitário para criar uma função "throttled" (limitada por frequência).
 * @author Seu Nome <seu.email@example.com>
 * @version 1.0.0
 */

/**
 * @summary Cria uma versão "throttled" de uma função, que limita sua frequência de execução.
 *
 * @description
 * Throttle é uma técnica que garante que uma função seja executada no máximo uma vez
 * a cada `wait` milissegundos. Ao contrário do `debounce` que espera um período de inatividade,
 * o `throttle` permite execuções contínuas, mas espaçadas no tempo.
 *
 * É ideal para controlar eventos que disparam com muita frequência e onde uma resposta periódica
 * é desejada, como em eventos de scroll, redimensionamento de janela ou movimento do mouse.
 * Esta implementação executa a função na primeira chamada ("leading edge") e ignora as
 * chamadas subsequentes durante o período de espera (cooldown).
 *
 * @param {Function} callback - A função que terá sua execução limitada.
 * @param {number} wait - O intervalo mínimo em milissegundos entre as execuções.
 *
 * @returns {(...args: any[]) => void} Uma nova função "throttled" que pode ser chamada no lugar da original.
 *
 * @throws {TypeError} Lança um erro se o `callback` não for uma função ou se `wait` não for um número.
 *
 * @example
 * // Exemplo: um evento de scroll que atualiza a UI, mas no máximo a cada 250ms.
 * let scrollCount = 0;
 * const onScroll = () => {
 * scrollCount++;
 * console.log(`Atualizando UI... Chamada nº ${scrollCount}`);
 * };
 *
 * const throttledScroll = throttle(onScroll, 250);
 *
 * // No navegador, você adicionaria o listener:
 * // window.addEventListener('scroll', throttledScroll);
 *
 * // Simulando chamadas rápidas:
 * throttledScroll(); // Executa: "Atualizando UI... Chamada nº 1"
 * throttledScroll(); // Ignorada (dentro do cooldown)
 * throttledScroll(); // Ignorada (dentro do cooldown)
 *
 * setTimeout(() => {
 * throttledScroll(); // Executa: "Atualizando UI... Chamada nº 2"
 * }, 300); // 300ms > 250ms, então o cooldown já acabou.
 */
function throttle(callback, wait) {
  // 1. Validação dos parâmetros na criação da função.
  if (typeof callback !== 'function') {
    throw new TypeError('O callback fornecido para o throttle deve ser uma função.');
  }
  if (typeof wait !== 'number' || wait < 0) {
    throw new TypeError('O tempo de espera (wait) do throttle deve ser um número não negativo.');
  }

  // 2. Closure para manter o estado de "cooldown" entre as chamadas.
  let inCooldown = false;

  // Usa uma função regular para preservar o contexto `this` de quem a chama.
  return function(...args) {
    // Se a função já foi chamada dentro do período de `wait`, ignora esta nova chamada.
    if (inCooldown) {
      return;
    }

    // 3. Executa o callback imediatamente na primeira chamada válida.
    // O `this` e os `args` são da chamada atual que está sendo executada.
    callback.apply(this, args);

    // 4. Inicia o período de "cooldown".
    inCooldown = true;

    // 5. Define um temporizador para terminar o "cooldown" após o tempo de espera,
    // permitindo que a função seja executada novamente.
    setTimeout(() => {
      inCooldown = false;
    }, wait);
  };
}

// ------------------------------------------------------------------------------------------------

module.exports = throttle