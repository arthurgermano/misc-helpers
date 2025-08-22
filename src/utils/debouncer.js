/**
 * @file Utilitário para criar uma função "debounced".
 * @author Seu Nome <seu.email@example.com>
 * @version 2.0.0
 */

/**
 * @summary Cria uma versão "debounced" de uma função, que atrasa sua execução.
 *
 * @description
 * Debounce é uma técnica que agrupa uma sequência de chamadas de uma função que ocorrem
 * rapidamente, executando-a apenas uma vez após um determinado período de inatividade.
 * É útil para controlar eventos que disparam com muita frequência, como a digitação em um
 * campo de busca, o redimensionamento da janela ou o scroll da página.
 *
 * Esta função retorna uma nova função que, ao ser invocada, reinicia um temporizador.
 * A função original (`callback`) só será executada quando o temporizador não for mais
 * reiniciado por um período igual a `timeout`.
 *
 * @param {Function} callback - A função que terá sua execução atrasada. Pode ser síncrona ou assíncrona.
 * @param {number} [timeout=1000] - O período de inatividade em milissegundos que deve
 * aguardar antes de executar o `callback`.
 *
 * @returns {(...args: any[]) => void} Uma nova função "debounced" que pode ser chamada no lugar da original.
 *
 * @throws {TypeError} Lança um erro se o `callback` não for uma função ou se `timeout` não for um número.
 *
 * @example
 * // Simula uma barra de busca que só pesquisa após o usuário parar de digitar.
 * const searchAPI = (query) => {
 * console.log(`Pesquisando por: "${query}"...`);
 * };
 *
 * const debouncedSearch = debouncer(searchAPI, 500);
 *
 * debouncedSearch('g');
 * debouncedSearch('ga');
 * debouncedSearch('gam');
 * debouncedSearch('gami');
 * // Após 500ms de inatividade, o console irá logar: "Pesquisando por: "gami"..."
 */
function debouncer(callback, timeout = 1000) {
  // 1. Validação dos parâmetros na criação da função.
  if (typeof callback !== 'function') {
    throw new TypeError('O callback fornecido para o debouncer deve ser uma função.');
  }
  if (typeof timeout !== 'number') {
    throw new TypeError('O timeout do debouncer deve ser um número.');
  }

  // 2. Closure para manter a referência do temporizador entre as chamadas.
  let timer;

  // 3. Retorna a nova função "debounced".
  // Usa uma função regular `function(...args)` para preservar o contexto `this` de quem a chama.
  return function(...args) {
    // Captura o contexto (`this`) e os argumentos da chamada atual.
    const context = this;

    // Cancela o temporizador anterior para reiniciar a contagem.
    // Isso garante que o callback só execute após o período de inatividade.
    clearTimeout(timer);

    // Inicia um novo temporizador.
    timer = setTimeout(() => {
      // Executa o callback original, aplicando o contexto e os argumentos corretos da última chamada.
      callback.apply(context, args);
    }, timeout);
  };
}

// ------------------------------------------------------------------------------------------------

module.exports = debouncer;