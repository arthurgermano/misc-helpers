/**
 * @file Utilitário para criar um atraso (delay) programático.
 */

/**
 * @summary Cria um atraso (delay) programático usando uma Promise.
 *
 * @description
 * Esta função é uma versão de `setTimeout` que pode ser usada com `async/await` para pausar
 * a execução de uma função assíncrona. Ela retorna uma Promise que será resolvida
 * ou rejeitada após o número de milissegundos especificado.
 *
 * @param {number} milliseconds - O número de milissegundos para esperar. Deve ser um número não negativo.
 * @param {*} [returnValue=true] - O valor com o qual a Promise será resolvida ou rejeitada.
 * @param {boolean} [throwError=false] - Se `true`, a Promise será rejeitada. Se `false` (padrão),
 * a Promise será resolvida.
 *
 * @returns {Promise<*>} Uma Promise que resolve ou rejeita após o atraso.
 *
 * @example
 * async function runProcess() {
 * console.log('Iniciando processo...'); // Ex: 17:18:43
 *
 * // Espera por 2 segundos e continua
 * await sleep(2000);
 * console.log('Processo continuado após 2 segundos.'); // Ex: 17:18:45
 *
 * try {
 * // Espera por 1 segundo e então rejeita a promise
 * await sleep(1000, 'Erro controlado', true);
 * } catch (error) {
 * console.error('Erro capturado:', error); // Erro capturado: Erro controlado
 * }
 * }
 *
 * runProcess();
 */
function sleep(milliseconds, returnValue = true, throwError = false) {
  // 1. Validação da entrada. Retorna uma promise já rejeitada para entradas inválidas.
  if (typeof milliseconds !== 'number' || milliseconds < 0) {
    const error = new TypeError('O tempo de espera (milliseconds) deve ser um número não negativo.');
    return Promise.reject(error);
  }

  // A função retorna uma nova Promise, que é o padrão para operações assíncronas.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 2. Decide se a promise deve ser resolvida ou rejeitada com base no parâmetro.
      if (throwError) {
        // Comportamento especial do código original: se o valor for o padrão `true`,
        // rejeita com um erro genérico para maior clareza.
        if (returnValue === true) {
          return reject(new Error("Sleep Error"));
        }
        // Caso contrário, rejeita com o valor personalizado fornecido.
        return reject(returnValue);
      }

      // 3. Resolve a promise com o valor fornecido.
      return resolve(returnValue);
    }, milliseconds);
  });
}

// ------------------------------------------------------------------------------------------------

export default sleep;