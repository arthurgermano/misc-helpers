/**
 * @file Utilitário seguro para dividir (split) strings.
 */

/**
 * @summary Divide uma string em um array de substrings com base em um separador.
 *
 * @description
 * Esta função é um wrapper seguro para o método nativo `String.prototype.split()`.
 * Ela lida com entradas que não são strings (como `null` ou `undefined`) de forma
 * graciosa, retornando um array vazio em vez de lançar um erro, o que a torna
 * mais segura para usar em pipelines de dados.
 *
 * @param {string} text - A string a ser dividida.
 * @param {string | RegExp} [char=" "] - O separador. Pode ser uma string ou uma Expressão Regular.
 *
 * @returns {string[]} Um array de substrings. Retorna um array vazio se a entrada
 * não for uma string válida ou for uma string vazia.
 *
 * @example
 * const fruits = 'maçã,banana,laranja';
 * const fruitArray = split(fruits, ',');
 * console.log(fruitArray); // ['maçã', 'banana', 'laranja']
 *
 * const empty = split(null);
 * console.log(empty); // []
 *
 * const sentence = "O rato roeu a roupa";
 * const words = split(sentence); // Usa o separador padrão " "
 * console.log(words); // ["O", "rato", "roeu", "a", "roupa"]
 */
function split(text, char = " ") {
  // 1. Validação: Garante que a entrada é uma string válida e não vazia.
  // Se não for, retorna um array vazio para evitar erros em tempo de execução.
  if (!text || typeof text !== "string") {
    return [];
  }

  // 2. Delega a operação para o método nativo e eficiente `split`.
  return text.split(char);
}

// ------------------------------------------------------------------------------------------------

export default split;