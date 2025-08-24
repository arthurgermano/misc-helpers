/**
 * @file Utilitário para adicionar mensagens a um array de log.
 */

/**
 * @typedef {object} LogEntry - Define a estrutura de uma entrada de log.
 * @property {string} time - O timestamp da entrada de log no formato ISO (UTC).
 * @property {string} message - A mensagem de log.
 * @property {*} [more_info] - Opcional. Informações adicionais ou metadados.
 */

/**
 * @summary Adiciona uma nova entrada a um array de logs, modificando-o.
 *
 * @description
 * Esta função adiciona uma nova entrada de log (com timestamp, mensagem e informações
 * adicionais) diretamente a um array existente.
 *
 * **Atenção:** Esta função é **mutável**, o que significa que ela **modifica
 * diretamente** o array `logObj` passado como argumento. Se o `logObj` fornecido não
 * for um array, um novo array será criado e retornado.
 *
 * @param {LogEntry[]} logObj - O array de log a ser modificado.
 * @param {string} message - A mensagem de log a ser adicionada.
 * @param {*} [more_info] - Opcional. Qualquer informação ou objeto adicional a ser incluído no log.
 *
 * @returns {LogEntry[]} O mesmo array de log que foi passado, agora com a nova mensagem.
 *
 * @example
 * const meuLog = [{ time: '...', message: 'Serviço iniciado.' }];
 * pushLogMessage(meuLog, 'Usuário conectado.', { userId: 123 });
 *
 * // O array original FOI modificado
 * console.log(meuLog.length); // 2
 * console.log(meuLog[1].message); // "Usuário conectado."
 *
 * // Se a variável de log não for um array, um novo é criado
 * let logInexistente; // undefined
 * logInexistente = pushLogMessage(logInexistente, 'Primeira mensagem.');
 * console.log(logInexistente.length); // 1
 */
function pushLogMessage(logObj, message, more_info) {
  // 1. Verifica se o `logObj` de entrada é um array.
  // Se não for, um novo array é criado para a variável local `logObj`.
  if (!Array.isArray(logObj)) {
    logObj = [];
  }

  // 2. Cria a nova entrada de log.
  const newEntry = {
    time: new Date().toISOString(),
    message,
  };

  // Adiciona o campo `more_info` ao objeto de log apenas se ele tiver sido fornecido.
  if (more_info !== undefined) {
    newEntry.more_info = more_info;
  }

  // 3. Adiciona a nova entrada diretamente ao array (mutação).
  logObj.push(newEntry);

  // 4. Retorna o array modificado.
  return logObj;
}

// ------------------------------------------------------------------------------------------------

export default pushLogMessage;