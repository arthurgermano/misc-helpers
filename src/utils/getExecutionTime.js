/**
 * @file Utilitário de alta precisão para medir o tempo de execução.
 * @author Seu Nome <seu.email@example.com>
 * @version 2.0.0
 */

/**
 * @summary Mede o tempo de execução com alta precisão (em milissegundos).
 *
 * @description
 * Esta função é um cronômetro de alta precisão que funciona de duas maneiras:
 * 1. **Sem argumentos:** `getExecutionTime()` - Retorna um "token" de tempo de alta resolução,
 * servindo como um ponto de partida para a medição.
 * 2. **Com argumento:** `getExecutionTime(startTime)` - Retorna a diferença de tempo (em milissegundos)
 * entre o momento atual e o `startTime` fornecido.
 *
 * Utiliza `process.hrtime.bigint()` no Node.js e `performance.now()` no navegador
 * para garantir a maior precisão possível em cada ambiente.
 *
 * @param {number | bigint} [time] - Opcional. Um marcador de tempo obtido previamente ao
 * chamar esta mesma função sem argumentos.
 *
 * @returns {number | bigint | string} Se `time` não for fornecido, retorna o marcador inicial (`bigint` no Node.js,
 * `number` no navegador). Se `time` for fornecido, retorna o tempo decorrido como uma `string`
 * formatada com 3 casas decimais.
 *
 * @example
 * const startTime = getExecutionTime();
 *
 * // Simula uma operação que demora ~50ms
 * await new Promise(resolve => setTimeout(resolve, 50));
 *
 * const duration = getExecutionTime(startTime);
 * console.log(`A operação demorou ${duration} ms.`); // Ex: "A operação demorou 50.123 ms."
 */
function getExecutionTime(time) {
  // **Ambiente Node.js:** usa `process.hrtime.bigint()` para precisão em nanossegundos.
  if (typeof process !== 'undefined' && typeof process.hrtime === 'function') {
    // Modo 1: Retorna o tempo atual em nanossegundos como um BigInt para ser o marcador inicial.
    if (time === undefined) {
      return process.hrtime.bigint();
    }

    // Validação para o marcador de tempo do Node.js.
    if (typeof time !== 'bigint') {
        return '0.000';
    }

    // Modo 2: Calcula a diferença em nanossegundos.
    const diffNanos = process.hrtime.bigint() - time;
    // Converte a diferença para milissegundos e formata.
    const diffMillis = Number(diffNanos) / 1e6;
    return diffMillis.toFixed(3);
  }

  // **Ambiente do Navegador:** usa `performance.now()` para precisão em milissegundos.
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    // Modo 1: Retorna o tempo atual em milissegundos como o marcador inicial.
    if (time === undefined) {
      return performance.now();
    }

    // Validação para o marcador de tempo do navegador.
    if (typeof time !== 'number' || !isFinite(time)) {
      return '0.000';
    }

    // Modo 2: Calcula a diferença e formata.
    const diffMillis = performance.now() - time;
    return diffMillis.toFixed(3);
  }

  // Fallback para ambientes muito antigos (raro). Retorna o tempo atual em ms.
  // Este modo não suporta medição de diferença de forma precisa.
  return (Date.now()).toFixed(3);
}

// ------------------------------------------------------------------------------------------------

module.exports = getExecutionTime;