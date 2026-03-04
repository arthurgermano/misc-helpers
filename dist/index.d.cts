import cloneDeep from 'lodash.clonedeep';
import { format } from 'date-fns/format';
import { strToU8, compressSync, decompressSync, strFromU8, zlibSync, unzlibSync } from 'fflate';
import { parse } from 'date-fns/parse';
import { decode } from 'cbor-x';

/**
 * @fileoverview Fornece uma função para comparar se uma data é anterior a outra.
 * O código é compatível com ambientes Node.js e navegadores.
 */

/**
 * Compara duas datas para determinar se a primeira (dateA) é anterior à segunda (dateB).
 *
 * @summary Verifica se a data A é anterior à data B.
 * @description Esta função compara duas instâncias de Date. Ela oferece opções para
 * ignorar a parte de horas/minutos/segundos, incluir datas iguais na validação e
 * controlar o comportamento em caso de erro.
 *
 * @param {Date} dateA A data que se espera ser a mais antiga.
 * @param {Date} dateB A data que se espera ser a mais recente.
 * @param {object} [options={}] Opções para customizar o comportamento da comparação.
 * @param {boolean} [options.considerHMS=false] Se `true`, a comparação inclui horas, minutos e segundos. Se `false`, apenas ano, mês e dia são considerados.
 * @param {boolean} [options.considerEquals=false] Se `true`, a função retorna `true` caso as datas sejam idênticas. Se `false`, retorna `false`.
 * @param {boolean} [options.ignoreErrors=false] Se `true`, retorna `null` caso os parâmetros não sejam instâncias de Date. Se `false`, lança um erro.
 * @returns {boolean|null} Retorna `true` se `dateA` for anterior (ou igual, se `considerEquals` for `true`) a `dateB`. Retorna `null` em caso de erro com `ignoreErrors` ativado.
 * @throws {TypeError} Lança um erro se `dateA` ou `dateB` não forem objetos Date e `ignoreErrors` for `false`.
 */
function dateCompareAsc(dateA, dateB, options = {}) {
  // 1. Configuração e Validação dos Parâmetros
  const finalOptions = {
    considerHMS: false,
    ignoreErrors: false,
    considerEquals: false,
    ...options,
  };

  if (!(dateA instanceof Date) || !(dateB instanceof Date)) {
    if (finalOptions.ignoreErrors) {
      return null;
    }
    // Lança um erro mais específico (TypeError) para o tipo de problema.
    const paramName = !(dateA instanceof Date) ? "dateA" : "dateB";
    throw new TypeError(
      `dateCompareAsc Function: ${paramName} provided is not a Date Object`
    );
  }

  // 2. Lógica de Comparação
  // O bloco try/catch é mantido para lidar com datas inválidas (ex: new Date('string-invalida')),
  // que são instâncias de Date, mas cujos métodos (getFullYear, etc.) lançam erros.
  try {
    let timeA;
    let timeB;

    // Remove a parte de horas, minutos e segundos, se a opção estiver desativada.
    if (!finalOptions.considerHMS) {
      timeA = new Date(
        dateA.getFullYear(),
        dateA.getMonth(),
        dateA.getDate()
      ).getTime();
      timeB = new Date(
        dateB.getFullYear(),
        dateB.getMonth(),
        dateB.getDate()
      ).getTime();
    } else {
      timeA = dateA.getTime();
      timeB = dateB.getTime();
    }

    // A expressão booleana combina as duas condições para um retorno verdadeiro.
    // 1. timeA é estritamente menor que timeB.
    // 2. timeA é igual a timeB E a opção 'considerEquals' está ativada.
    return timeA < timeB || (timeA === timeB && finalOptions.considerEquals);
  } catch (error) {
    if (finalOptions.ignoreErrors) {
      return null;
    }
    // Re-lança o erro original se a opção de ignorar não estiver ativa.
    throw error;
  }
}
// ------------------------------------------------------------------------------------------------

/**
 * @fileoverview Fornece uma função para comparar se uma data é posterior a outra.
 * O código é compatível com ambientes Node.js e navegadores.
 */

/**
 * Compara duas datas para determinar se a primeira (dateA) é posterior à segunda (dateB).
 *
 * @summary Verifica se a data A é posterior à data B.
 * @description Esta função compara duas instâncias de Date. Ela oferece opções para
 * ignorar a parte de horas/minutos/segundos, incluir datas iguais na validação e
 * controlar o comportamento em caso de erro.
 *
 * @param {Date} dateA A data que se espera ser a mais recente.
 * @param {Date} dateB A data que se espera ser a mais antiga.
 * @param {object} [options={}] Opções para customizar o comportamento da comparação.
 * @param {boolean} [options.considerHMS=false] Se `true`, a comparação inclui horas, minutos e segundos. Se `false`, apenas ano, mês e dia são considerados.
 * @param {boolean} [options.considerEquals=false] Se `true`, a função retorna `true` caso as datas sejam idênticas. Se `false`, retorna `false`.
 * @param {boolean} [options.ignoreErrors=false] Se `true`, retorna `null` caso os parâmetros não sejam instâncias de Date. Se `false`, lança um erro.
 * @returns {boolean|null} Retorna `true` se `dateA` for posterior (ou igual, se `considerEquals` for `true`) a `dateB`. Retorna `null` em caso de erro com `ignoreErrors` ativado.
 * @throws {Error} Lança um erro se `dateA` ou `dateB` não forem objetos Date e `ignoreErrors` for `false`.
 */
function dateCompareDesc(dateA, dateB, options = {}) {
  // 1. Configuração e Validação dos Parâmetros
  const finalOptions = {
    considerHMS: false,
    ignoreErrors: false,
    considerEquals: false,
    ...options,
  };

  // Valida 'dateA' e mantém a mensagem de erro original.
  if (!(dateA instanceof Date)) {
    if (finalOptions.ignoreErrors) {
      return null;
    }
    throw new Error(
      "dateCompareDesc Function: dateA provided is not a Date Object"
    );
  }

  // Valida 'dateB' e mantém a mensagem de erro original.
  if (!(dateB instanceof Date)) {
    if (finalOptions.ignoreErrors) {
      return null;
    }
    throw new Error(
      "dateCompareDesc Function: dateB provided is not a Date Object"
    );
  }

  // 2. Lógica de Comparação
  try {
    let timeA;
    let timeB;

    // Remove a parte de horas, minutos e segundos, se a opção estiver desativada.
    if (!finalOptions.considerHMS) {
      timeA = new Date(
        dateA.getFullYear(),
        dateA.getMonth(),
        dateA.getDate()
      ).getTime();
      timeB = new Date(
        dateB.getFullYear(),
        dateB.getMonth(),
        dateB.getDate()
      ).getTime();
    } else {
      timeA = dateA.getTime();
      timeB = dateB.getTime();
    }

    // A expressão booleana combina as duas condições para um retorno verdadeiro.
    // 1. timeA é estritamente maior que timeB.
    // 2. timeA é igual a timeB E a opção 'considerEquals' está ativada.
    return timeA > timeB || (timeA === timeB && finalOptions.considerEquals);
  } catch (error) {
    if (finalOptions.ignoreErrors) {
      return null;
    }
    // Re-lança o erro original se a opção de ignorar não estiver ativa.
    throw error;
  }
}
// ------------------------------------------------------------------------------------------------

/**
 * @fileoverview Fornece uma função para retornar um valor numérico válido ou um valor
 * padrão caso o valor principal seja inválido.
 */

/**
 * Retorna um valor numérico válido ou o valor padrão (`defaultValue`) caso o valor
 * verificado (`checkValue`) não seja um número finito ou seja menor que 1.
 *
 * @summary Retorna um valor numérico válido ou o valor padrão fornecido.
 * @description Esta função garante que o valor retornado seja um número inteiro, finito
 * e maior ou igual a 1. Caso contrário, retorna o valor padrão fornecido. É útil para
 * cenários onde limites, quantidades ou índices não podem ser negativos, nulos, NaN ou infinitos.
 *
 * @param {*} checkValue - O valor a ser verificado.
 * @param {number} defaultValue - O valor padrão a ser retornado caso `checkValue` seja inválido.
 * @returns {number} Retorna o número validado ou `defaultValue` caso `checkValue` seja inválido.
 * @example
 * // Casos de substituição
 * defaultNumeric("abc", 10);     // Retorna 10
 * defaultNumeric(NaN, 5);        // Retorna 5
 * defaultNumeric(-3, 1);         // Retorna 1
 * defaultNumeric(Infinity, 2);   // Retorna 2
 *
 * // Casos válidos
 * defaultNumeric(7, 1);          // Retorna 7
 * defaultNumeric("12", 1);       // Retorna 12
 * defaultNumeric(1.9, 1);        // Retorna 1 (arredondado para baixo)
 */
function defaultNumeric(checkValue, defaultValue) {
  const num = Number(checkValue);
  return Number.isFinite(num) && !isNaN(num) ? num : defaultValue;
}
// ------------------------------------------------------------------------------------------------

/**
 * @fileoverview Fornece uma função para retornar um valor padrão caso o valor
 * principal seja nulo ou indefinido.
 */

/**
 * Retorna um valor padrão (`defaultValue`) se o valor verificado (`checkValue`) for `null` ou `undefined`.
 *
 * @summary Retorna um valor padrão para valores nulos ou indefinidos.
 * @description Esta função é um substituto seguro para o operador `||` em casos onde valores
 * como `0`, `false` ou `''` (string vazia) são considerados válidos e não devem ser
 * substituídos pelo valor padrão.
 *
 * @param {*} checkValue - O valor a ser verificado.
 * @param {*} defaultValue - O valor padrão a ser retornado caso `checkValue` seja `null` ou `undefined`.
 * @returns {*} Retorna `checkValue` se ele não for nulo ou indefinido; caso contrário, retorna `defaultValue`.
 * @example
 * // Casos de substituição
 * defaultValue(null, "padrão");       // Retorna "padrão"
 * defaultValue(undefined, 100);    // Retorna 100
 *
 * // Casos de não substituição (valores "falsy" válidos)
 * defaultValue(0, 10);               // Retorna 0
 * defaultValue("", "texto");         // Retorna ""
 * defaultValue(false, true);         // Retorna false
 *
 * // Caso com valor válido
 * defaultValue("olá", "mundo");      // Retorna "olá"
 */
function defaultValue(checkValue, defaultValue) {
  // O operador de coalescência nula (??) executa a mesma lógica da função original
  // de forma nativa, concisa e performática.
  return checkValue ?? defaultValue;
}
// ------------------------------------------------------------------------------------------------

/**
 * @fileoverview Fornece uma função utilitária que encapsula o operador nativo "instanceof".
 */

/**
 * Verifica se um objeto é uma instância de um determinado tipo (construtor).
 *
 * @summary Verifica se um objeto pertence a uma determinada classe ou tipo.
 * @description Esta função é um encapsulamento direto do operador `instanceof` do JavaScript.
 * Ele verifica se a propriedade `prototype` de um construtor aparece em algum lugar
 * na cadeia de protótipos de um objeto.
 *
 * @param {*} object - O objeto a ser verificado.
 * @param {Function} instanceType - O construtor (classe) contra o qual o objeto será verificado.
 * @returns {boolean} Retorna `true` se o objeto for uma instância do tipo fornecido; caso contrário, `false`.
 * @throws {TypeError} Lança um erro se `instanceType` não for um objeto com um construtor
 * (ex: `null`, `undefined`), replicando o comportamento nativo do operador `instanceof`.
 *
 * @example
 * // Usando construtores nativos
 * isInstanceOf(new Date(), Date);     // Retorna true
 * isInstanceOf([], Array);           // Retorna true
 * isInstanceOf("texto", String);     // Retorna false (primitivas não são instâncias diretas)
 *
 * // Usando classes personalizadas
 * class Carro {}
 * const meuCarro = new Carro();
 * isInstanceOf(meuCarro, Carro);      // Retorna true
 */
function isInstanceOf(object, instanceType) {
  // A função é um encapsulamento direto do operador nativo 'instanceof'.
  // Esta é a forma mais performática e direta de realizar a verificação.
  return object instanceof instanceType;
}
// ------------------------------------------------------------------------------------------------

/**
 * @fileoverview Fornece uma função para verificar se um valor é um número finito.
 */

/**
 * Verifica se um valor fornecido é um número finito.
 *
 * @summary Verifica se um valor é um número real e finito.
 * @description Esta função determina se o valor fornecido é do tipo `number` e não é
 * `NaN`, `Infinity` ou `-Infinity`. Diferente de outras verificações como `!isNaN()`,
 * esta função não tenta converter a entrada para um número, sendo mais rigorosa e segura.
 *
 * @param {*} value - O valor a ser verificado.
 * @returns {boolean} Retorna `true` se o valor for um número finito; caso contrário, `false`.
 * @example
 * // Casos verdadeiros
 * isNumber(123);      // true
 * isNumber(-1.23);    // true
 * isNumber(0);        // true
 *
 * // Casos falsos
 * isNumber(Infinity); // false
 * isNumber(NaN);      // false
 * isNumber('123');    // false (não converte string)
 * isNumber(null);     // false
 * isNumber({});       // false
 */
function isNumber(value) {
  // A função estática Number.isFinite() já realiza as três verificações do código
  // original de forma nativa:
  // 1. Garante que o tipo seja 'number'.
  // 2. Garante que não seja NaN.
  // 3. Garante que não seja Infinity ou -Infinity.
  return Number.isFinite(value);
}
// ------------------------------------------------------------------------------------------------

/**
 * @fileoverview Fornece uma função para verificar se um valor é um objeto.
 */

/**
 * Verifica se um valor fornecido é um objeto, excluindo `null`.
 *
 * @summary Verifica se um valor é um objeto (mas não nulo).
 * @description Esta função retorna `true` para qualquer valor que o JavaScript considera
 * um objeto (`typeof valor === 'object'`), com a exceção explícita de `null`.
 * Note que, devido à natureza do JavaScript, isso inclui arrays e instâncias de outras
 * classes (como `Date`), mas não inclui tipos primitivos.
 *
 * @param {*} object - O valor a ser verificado.
 * @returns {boolean} Retorna `true` se o valor for um objeto e não for `null`; caso contrário, `false`.
 * @example
 * // Casos verdadeiros
 * isObject({});               // true
 * isObject({ a: 1 });       // true
 * isObject([]);               // true (arrays são objetos)
 * isObject(new Date());       // true (instâncias de classe são objetos)
 *
 * // Casos falsos
 * isObject(null);             // false (a principal exceção)
 * isObject(undefined);        // false
 * isObject("texto");          // false (primitivo)
 * isObject(123);              // false (primitivo)
 * isObject(() => {});         // false (funções têm typeof 'function')
 */
function isObject(object) {
  // A verificação `object !== null` é crucial porque `typeof null` retorna 'object'.
  // Esta linha combina as duas verificações da função original de forma mais concisa.
  return object !== null && typeof object === "object";
}
// ------------------------------------------------------------------------------------------------

// Default export para compatibilidade
var index$6 = {
  dateCompareAsc,
  dateCompareDesc,
  defaultNumeric,
  defaultValue,
  isInstanceOf,
  isNumber,
  isObject,
};

declare const helpersNamespace_dateCompareAsc: typeof dateCompareAsc;
declare const helpersNamespace_dateCompareDesc: typeof dateCompareDesc;
declare const helpersNamespace_defaultNumeric: typeof defaultNumeric;
declare const helpersNamespace_defaultValue: typeof defaultValue;
declare const helpersNamespace_isInstanceOf: typeof isInstanceOf;
declare const helpersNamespace_isNumber: typeof isNumber;
declare const helpersNamespace_isObject: typeof isObject;
declare namespace helpersNamespace {
  export { helpersNamespace_dateCompareAsc as dateCompareAsc, helpersNamespace_dateCompareDesc as dateCompareDesc, index$6 as default, helpersNamespace_defaultNumeric as defaultNumeric, helpersNamespace_defaultValue as defaultValue, helpersNamespace_isInstanceOf as isInstanceOf, helpersNamespace_isNumber as isNumber, helpersNamespace_isObject as isObject };
}

// ------------------------------------------------------------------------------------------------

  /**
   * @summary Realiza uma cópia profunda (deep clone) e uma fusão (merge) de dois objetos, retornando um novo objeto.
   * @description Esta função cria cópias profundas dos objetos 'target' e 'source' para garantir imutabilidade
   * e, em seguida, mescla as propriedades do 'source' no 'target'. As propriedades do 'source'
   * sobrescrevem as propriedades de mesmo nome no 'target'.
   *
   * @param {object} [target={}] - O objeto de destino. Servirá de base para a fusão.
   * @param {object} [source={}] - O objeto de origem. Suas propriedades serão mescladas no 'target'.
   * @param {object} [options={}] - Opções de configuração para a função.
   * @param {boolean} [options.throwsError=true] - Se `true`, a função lançará um erro em caso de parâmetros inválidos. Se `false`, retornará `null`.
   * @returns {object|null} Um novo objeto com o resultado da fusão, ou `null` se ocorrer um erro e `options.throwsError` for `false`.
   *
   * @example
   * const defaults = { user: { name: 'Anônimo', rights: ['read'] } };
   * const settings = { user: { name: 'Admin' }, theme: 'dark' };
   *
   * const finalConfig = assign(defaults, settings);
   * // finalConfig é: { user: { name: 'Admin', rights: ['read'] }, theme: 'dark' }
   * // Os objetos 'defaults' e 'settings' não são modificados.
   */
  function assign(target = {}, source = {}, options = {}) {
    const { throwsError = true } = options;

    // Validação aprimorada para garantir que os parâmetros são objetos válidos (e não nulos).
    if (target === null || typeof target !== "object") {
      if (throwsError) {
        throw new Error("assign: O parâmetro 'target' deve ser um objeto.");
      }
      return null;
    }
    if (source === null || typeof source !== "object") {
      if (throwsError) {
        throw new Error("assign: O parâmetro 'source' deve ser um objeto.");
      }
      return null;
    }

    try {
      // Usa cloneDeep para evitar a mutação dos objetos originais.
      // Object.assign realiza a fusão superficial dos objetos já clonados.
      return Object.assign(cloneDeep(target), cloneDeep(source));
    } catch (error) {
      if (throwsError) {
        // Re-lança o erro original para preservar o stack trace e a mensagem específica.
        throw error;
      }
      // Retorna null para manter a consistência com a validação de parâmetros.
      return null;
    }
  }

  // ------------------------------------------------------------------------------------------------

/**
 * @summary Decodifica uma string Base64 para texto de forma isomórfica.
 *
 * @description
 * Esta função detecta o ambiente de execução (Node.js ou Navegador) para decodificar
 * uma string no formato Base64.
 *
 * - **No Node.js:** A função decodifica a string Base64 para uma string de texto no formato UTF-8,
 * lidando corretamente com acentuação e caracteres especiais.
 * - **No Navegador:** A função utiliza `atob()`, que decodifica a string Base64 para uma
 * "string binária". Cada caractere na string de saída representa um byte dos dados originais.
 *
 *
 * @param {string} [text=""] - A string no formato Base64 a ser decodificada.
 * @returns {string} Uma string decodificada. No Node.js, será uma string UTF-8. No navegador,
 * será uma "string binária". Retorna uma string vazia se a entrada for inválida.
 */
function base64From(text = "") {
  if (typeof text != "string" || !text) {
    return "";
  }
  if (typeof window === "undefined") {
    return Buffer.from(text, "base64").toString("utf-8");
  }
  return atob(text);
}

/**
 * @file Utilitário para conversão de Base64URL para Base64 padrão.
 */

/**
 * @summary Converte uma string do formato Base64URL para o formato Base64 padrão.
 *
 * @description
 * O formato Base64URL é uma variação do Base64 projetada para ser segura em URLs e nomes de arquivo.
 * Ele substitui os caracteres `+` e `/` por `-` e `_`, respectivamente, e geralmente omite o
 * preenchimento (`=`) no final da string.
 *
 * Esta função reverte essas substituições e restaura o preenchimento (`=`)
 * necessário para que a string seja uma representação Base64 válida, cujo comprimento
 * deve ser um múltiplo de 4.
 *
 * @param {string} [urlSafeBase64=""] - A string em formato Base64URL a ser convertida.
 *
 * @returns {string} A string convertida para o formato Base64 padrão.
 *
 * @example
 * // Exemplo com uma string que precisa de preenchimento
 * const urlSafeString = 'rqXRQrq_mSFhX4c2wSZJrA';
 * const standardBase64 = base64FromBase64URLSafe(urlSafeString);
 * console.log(standardBase64); // "rqXRQrq/mSFhX4c2wSZJrA=="
 *
 * // Exemplo com uma string que não precisa de preenchimento
 * const anotherUrlSafeString = 'Zm9vYg';
 * const anotherStandardBase64 = base64FromBase64URLSafe(anotherUrlSafeString);
 * console.log(anotherStandardBase64); // "Zm9vYg=="
 */
function base64FromBase64URLSafe(urlSafeBase64 = "") {
  // Validação explícita para garantir que a entrada é uma string não vazia.
  if (typeof urlSafeBase64 !== 'string' || urlSafeBase64.length === 0) {
    return "";
  }

  // 1. Substitui os caracteres específicos do Base64URL pelos do Base64 padrão.
  // O uso da flag /g garante que todas as ocorrências sejam substituídas.
  const base64 = urlSafeBase64.replace(/-/g, "+").replace(/_/g, "/");

  // 2. Calcula e adiciona o preenchimento ('=') de forma eficiente.
  // O método `padEnd` é mais performático e declarativo que um loop `while`.
  // Ele calcula quantos caracteres `=` são necessários e os adiciona de uma só vez.
  const requiredPadding = (4 - (base64.length % 4)) % 4;
  return base64.padEnd(base64.length + requiredPadding, "=");
}

/**
 * @file Utilitário seguro e robusto para conversão de valores para string.
 */

/**
 * @summary Converte um valor de qualquer tipo para uma string de forma segura.
 *
 * @description
 * Esta função é uma versão mais robusta do construtor `String()`. Ela prioriza o método
 * `.toString()` customizado de um objeto. Apenas se um objeto não tiver um `.toString()`
 * customizado (resultando no padrão `"[object Object]"`), a função tentará convertê-lo
 * para uma string JSON.
 *
 * @param {*} [textObj=""] - O valor a ser convertido para string.
 * @param {boolean} [objectToJSON=true] - Se `true` e a entrada for um objeto sem `.toString()`
 * customizado, tenta convertê-lo para uma string JSON.
 *
 * @returns {string} A representação do valor como string.
 *
 * @example
 * const custom = { toString: () => 'Custom!' };
 * toString(custom);           // 'Custom!'
 *
 * toString({ a: 1 });         // '{"a":1}'
 * toString({ a: 1 }, false);  // '[object Object]'
 * toString(123);              // '123'
 * toString(null);             // ''
 */
function toString(textObj = "", objectToJSON = true) {
  // 1. Lida com `null` e `undefined` primeiro, retornando uma string vazia.
  if (textObj == null) {
    return "";
  }

  // 2. Realiza a conversão inicial para string.
  // O construtor `String()` invoca corretamente o método `.toString()` do objeto.
  const initialString = String(textObj);

  // 3. Verifica se a conversão inicial resultou na string genérica de objeto.
  // O `typeof` previne que a string literal "[object Object]" seja convertida para JSON.
  if (
    objectToJSON &&
    initialString === '[object Object]' &&
    typeof textObj === 'object'
  ) {
    try {
      // Se for um objeto genérico, tenta uma conversão JSON mais informativa.
      return JSON.stringify(textObj);
    } catch (error) {
      // Se o JSON falhar (ex: referência circular), retorna a string genérica.
      return initialString;
    }
  }

  // 4. Se não for um objeto genérico (ou se for um primitivo, array, ou objeto customizado),
  // a conversão inicial já é a correta.
  return initialString;
}

// ------------------------------------------------------------------------------------------------

/**
 * @summary Codifica uma string para o formato Base64 sem padding, de forma isomórfica.
 *
 * @description
 * Esta função detecta o ambiente de execução (Node.js ou Navegador) e codifica
 * o texto de entrada para uma string Base64, removendo os caracteres de padding (`=`) no final.
 *
 * - **No Node.js:** A função é mais robusta, utilizando `Buffer.from()`. Ela pode converter
 * números para strings e aceita um `fromFormat` para especificar a codificação do texto
 * de entrada (ex: 'utf-8').
 * - **No Navegador:** A função utiliza `btoa()`, que opera sobre "strings binárias".
 *
 *
 * @param {string|number} [text=""] - O texto a ser codificado. Se for um número, será convertido para string (apenas no Node.js).
 * @param {string} [fromFormat] - A codificação do texto de entrada (ex: 'utf-8', 'binary').
 * **Este parâmetro é utilizado apenas no ambiente Node.js.**
 * @returns {string} A string codificada em Base64, sem os caracteres de padding (`=`).
 */
function base64To(text = "", fromFormat) {
  let b64;
  if (typeof window === "undefined") {
    if (isNumber(text)) {
      text = toString(text);
    }
    b64 = Buffer.from(text, fromFormat).toString("base64");
  } else {
    b64 = btoa(text);
  }
  return b64.replaceAll("=", "");
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para conversão de ArrayBuffer para Base64.
 */

/**
 * @summary Converte um ArrayBuffer em uma string Base64.
 *
 * @description
 * Esta função é cross-environment, funcionando de forma otimizada tanto em Node.js quanto
 * em navegadores. Ela lida com a conversão de dados binários brutos de um ArrayBuffer
 * para sua representação textual em Base64.
 *
 * No navegador, a função processa o buffer em blocos (chunks) para evitar erros de
 * "Maximum call stack size exceeded", garantindo a conversão segura de buffers grandes.
 *
 * @param {ArrayBuffer} buffer - O ArrayBuffer a ser convertido.
 *
 * @returns {string} A representação da string em Base64. Retorna uma string vazia
 * se a entrada não for um ArrayBuffer válido.
 *
 * @example
 * const data = new Uint8Array([0, 1, 2, 3, 253, 254, 255]);
 * const base64String = base64FromBuffer(data.buffer);
 * console.log(base64String); // "AAECA/3+/w=="
 */
function base64FromBuffer(buffer) {
  // Adiciona validação para garantir que a entrada é do tipo esperado.
  if (!(buffer instanceof ArrayBuffer)) {
    return "";
  }

  // **Ambiente Node.js:**
  // A verificação `typeof window` é a forma padrão de diferenciar os ambientes.
  if (typeof window === "undefined") {
    // A forma mais eficiente no Node: converte o ArrayBuffer para um Buffer nativo
    // e delega para a função de encoding, que é otimizada para isso.
    return base64To(Buffer.from(buffer));
  }

  // **Ambiente do Navegador (implementação robusta):**
  const bytes = new Uint8Array(buffer);
  const CHUNK_SIZE = 8192; // Define um tamanho de bloco seguro (8KB)
  const chunks = [];

  // Itera sobre o buffer em blocos para evitar estouro de pilha.
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    // Pega um "pedaço" do buffer. `subarray` é eficiente pois não cria uma nova cópia dos dados.
    const chunk = bytes.subarray(i, i + CHUNK_SIZE);

    // Converte o bloco de bytes em uma string binária e a armazena.
    // Usar um array e `join` no final é geralmente mais performático que concatenação com `+=`.
    chunks.push(String.fromCharCode.apply(null, chunk));
  }

  // Junta os blocos de string em um só e passa para a função de encoding (que usará btoa).
  return base64To(chunks.join(""));
}

/**
 * @file Utilitário para decodificar Base64 para um ArrayBuffer.
 */

/**
 * @summary Converte uma string Base64 em um ArrayBuffer, compatível com ambos ambientes.
 *
 * @description
 * Esta função decodifica uma string Base64 para sua representação binária em um ArrayBuffer.
 * A implementação é cross-environment, garantindo um comportamento consistente e
 * retornando sempre um `ArrayBuffer` tanto no Node.js quanto em navegadores.
 *
 * @param {string} [base64String=""] - A string em formato Base64 a ser decodificada.
 *
 * @returns {ArrayBuffer} O `ArrayBuffer` decodificado. Retorna um `ArrayBuffer` vazio
 * (de 0 bytes) se a entrada for inválida, vazia ou se ocorrer um erro de decodificação.
 *
 * @example
 * const b64 = 'AAECAwQFBgcICQoLDA0ODw=='; // Bytes 0-15
 * const buffer = base64ToBuffer(b64);
 *
 * // `buffer` é sempre um ArrayBuffer.
 * const view = new Uint8Array(buffer);
 * console.log(view[10]); // 10
 */
function base64ToBuffer(base64String = "") {
  // Valida a entrada para garantir que é uma string.
  if (typeof base64String !== 'string' || base64String.length === 0) {
    // Retorna um ArrayBuffer vazio para entradas inválidas, conforme esperado pelos testes.
    return new ArrayBuffer(0);
  }

  try {
    // **Ambiente Node.js:**
    if (typeof window === 'undefined') {
      // Cria um Buffer do Node.js a partir da string Base64.
      const nodeBuffer = Buffer.from(base64String, 'base64');

      // Extrai o ArrayBuffer subjacente do Buffer do Node.js para manter a consistência do retorno.
      // O `slice` é crucial para garantir que obtenhamos a porção exata da memória
      // que corresponde a este buffer, já que o Node.js pode reutilizar pools de memória maiores.
      return nodeBuffer.buffer.slice(
        nodeBuffer.byteOffset,
        nodeBuffer.byteOffset + nodeBuffer.byteLength
      );
    }

    // **Ambiente do Navegador:**
    // Decodifica a string Base64 para uma "string binária".
    const binaryString = window.atob(base64String);
    const len = binaryString.length;

    // Cria um Uint8Array (uma visão de dados sobre um ArrayBuffer) com o tamanho necessário.
    const bytes = new Uint8Array(len);

    // Popula o array de bytes com os valores numéricos correspondentes a cada caractere.
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Retorna o `ArrayBuffer` subjacente, que contém os dados binários brutos.
    return bytes.buffer;

  } catch (error) {
    // Retorna um ArrayBuffer vazio em caso de erro
    return new ArrayBuffer(0);
  }
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para codificação no formato Base64URL.
 */

/**
 * @summary Codifica uma entrada para o formato Base64URL.
 *
 * @description
 * Esta função converte qualquer valor de entrada para uma string no formato Base64URL.
 * O Base64URL é uma variação do Base64 padrão, segura para uso em URLs e nomes de arquivo,
 * pois substitui os caracteres `+` e `/` por `-` e `_`, respectivamente, e omite o
 * preenchimento final (`=`). A função é cross-environment, funcionando em Node.js e navegadores.
 *
 * @param {*} [text=""] - O valor a ser codificado. Será convertido para string antes do processo.
 * @param {BufferEncoding} [fromFormat="utf8"] - **(Apenas Node.js)** A codificação da entrada,
 * se for uma string em um formato diferente de UTF-8 (ex: 'hex').
 *
 * @returns {string} A string resultante no formato Base64URL.
 *
 * @example
 * // A string "subjects?_id=1&_id=2" contém caracteres que não são seguros em URLs.
 * const queryString = 'subjects?_id=1&_id=2';
 * const encodedQuery = base64URLEncode(queryString);
 * console.log(encodedQuery); // "c3ViamVjdHM_X2lkPTEmX2lkPTI"
 *
 * // A saída pode ser usada com segurança em uma URL:
 * // https://example.com/q=c3ViamVjdHM_X2lkPTEmX2lkPTI
 */
function base64URLEncode(text = "", fromFormat = "utf8") {
  // 1. Delega a conversão para string e a codificação Base64 para a função `base64To`.
  // A função `base64To` já lida com diferentes tipos de entrada e remove o preenchimento (`=`).
  const standardBase64 = base64To(toString(text), fromFormat);

  // 2. Converte a saída do Base64 padrão para o formato URL-safe.
  // Substitui os caracteres '+' por '-' e '/' por '_'.
  return standardBase64.replace(/\+/g, "-").replace(/\//g, "_");
}

/**
 * @file Utilitário para comparação binária de ArrayBuffers.
 */

/**
 * @summary Compara dois ArrayBuffers para verificar se contêm os mesmos bytes.
 *
 * @description
 * Realiza uma comparação binária eficiente de dois ArrayBuffers. A função é otimizada
 * para diferentes ambientes: no Node.js, utiliza o método nativo e rápido `Buffer.equals()`,
 * enquanto no navegador, emprega uma técnica de comparação por blocos para acelerar o processo.
 *
 * @param {ArrayBuffer} buffer1 - O primeiro ArrayBuffer para a comparação.
 * @param {ArrayBuffer} buffer2 - O segundo ArrayBuffer para a comparação.
 *
 * @returns {boolean} Retorna `true` se os buffers forem idênticos, caso contrário, `false`.
 *
 * @example
 * const buf1 = new Uint8Array([1, 2, 3, 4, 5]).buffer;
 * const buf2 = new Uint8Array([1, 2, 3, 4, 5]).buffer;
 * const buf3 = new Uint8Array([1, 2, 3, 4, 9]).buffer;
 *
 * console.log(bufferCompare(buf1, buf2)); // true
 * console.log(bufferCompare(buf1, buf3)); // false
 */
function bufferCompare(buffer1, buffer2) {
  if (!buffer1 || !buffer2 || buffer1.byteLength !== buffer2.byteLength) {
    return false;
  }

  const view1 = new Uint8Array(buffer1);
  const view2 = new Uint8Array(buffer2);
  for (let i = 0; i < view1.length; i++) {
    if (view1[i] !== view2[i]) return false;
  }
  return true;
}

/**
 * @file Utilitário para concatenação de objetos "buffer-like".
 */

/**
 * @summary Concatena dois objetos "buffer-like" em um novo ArrayBuffer.
 *
 * @description
 * Esta função une dois objetos que se comportam como buffers (ex: ArrayBuffer,
 * Node.js Buffer, Uint8Array). Ela cria um novo ArrayBuffer contendo os bytes
 * do primeiro buffer seguidos pelos bytes do segundo. A implementação é robusta,
 * segura e universalmente compatível com Node.js e navegadores.
 *
 * @param {ArrayBuffer | Buffer | Uint8Array | null} buffer1 - O primeiro objeto buffer-like.
 * @param {ArrayBuffer | Buffer | Uint8Array | null} buffer2 - O segundo objeto buffer-like.
 *
 * @returns {ArrayBuffer | null} Um novo ArrayBuffer contendo a concatenação dos dois,
 * ou `null` se alguma das entradas for `null` ou se ocorrer um erro.
 *
 * @example
 * const buf1 = new Uint8Array([1, 2]).buffer;
 * const buf2 = new Uint8Array([3, 4]);
 * const combined = bufferConcatenate(buf1, buf2); // -> Retorna ArrayBuffer com [1, 2, 3, 4]
 *
 * const invalid = bufferConcatenate(buf1, null); // -> Retorna null
 */
function bufferConcatenate(buffer1, buffer2) {
  // 1. Validação explícita para `null` ou `undefined`.
  // A verificação `== null` é uma forma concisa de tratar ambos os casos.
  if (buffer1 == null || buffer2 == null) {
    return buffer1 || buffer2 || null;
  }

  try {
    // 2. Implementação Universal com Uint8Array.
    // O construtor do `Uint8Array` lida nativamente com diversos tipos de buffer.
    const view1 = new Uint8Array(buffer1);
    const view2 = new Uint8Array(buffer2);

    // Cria uma nova visão com o tamanho combinado.
    const resultView = new Uint8Array(view1.length + view2.length);

    // Copia os bytes de forma eficiente para a nova visão.
    resultView.set(view1, 0);
    resultView.set(view2, view1.length);

    // Retorna o ArrayBuffer subjacente.
    return resultView.buffer;
  } catch (error) {
    // Captura quaisquer outros erros que possam ocorrer com tipos de entrada inesperados
    // e retorna `null` para indicar a falha.
    return null;
  }
}

/**
 * @file Utilitário para converter uma string para um buffer de bytes.
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
  return new TextEncoder(encoding).encode(txtString);
}

/**
 * @file Utilitário para converter um buffer de bytes para uma string.
 */

/**
 * @summary Converte um buffer de bytes (`ArrayBuffer`, `Buffer`, etc.) para uma string.
 *
 * @description
 * Esta função converte dados binários para sua representação como string de texto.
 * A função é universalmente compatível, usando o método `toString()` do `Buffer` no Node.js
 * e a API `TextDecoder` no navegador.
 *
 * @param {ArrayBuffer | Buffer | Uint8Array} buffer - O buffer a ser convertido para string.
 * @param {BufferEncoding} [encoding="utf-8"] - **(Apenas Node.js)** A codificação a ser usada
 * para interpretar os bytes. Exemplos: 'utf-8', 'hex', 'base64', 'latin1'.
 * **No ambiente do navegador, este parâmetro é ignorado e a decodificação será sempre UTF-8**,
 * devido a limitações da API `TextDecoder`.
 *
 * @returns {string} A string resultante da decodificação do buffer. Retorna uma string vazia
 * se a entrada for inválida ou vazia.
 *
 * @example
 * // Criando um buffer a partir de uma string (exemplo)
 * const myBuffer = new TextEncoder().encode('Olá, Mundo! 👋');
 *
 * const text = bufferToString(myBuffer);
 * console.log(text); // "Olá, Mundo! 👋"
 *
 * // Exemplo específico do Node.js com 'hex'
 * // const hexBuffer = Buffer.from('4f6c612c204d756e646f2120f09f918b', 'hex');
 * // const textFromHex = bufferToString(hexBuffer, 'utf-8'); // "Olá, Mundo! 👋"
 */
function bufferToString(buffer, encoding = "utf-8") {
  // 1. Validação da entrada: retorna string vazia para entradas nulas ou indefinidas.
  if (buffer == null) {
    return "";
  }

  // **Ambiente Node.js:**
  if (typeof window === 'undefined') {
    // Garante que estamos trabalhando com um Buffer do Node.js para usar seu método `toString`.
    const nodeBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
    // Usa o método nativo do Buffer, que é otimizado e suporta múltiplos encodings.
    return nodeBuffer.toString(encoding);
  }

  // **Ambiente do Navegador:**
  try {
    // `TextDecoder` é a API padrão da web para converter bytes em string.
    // Ela sempre decodifica como UTF-8, ignorando o parâmetro `encoding`.
    return new TextDecoder().decode(buffer);
  } catch (error) {
    // Retorna uma string vazia se o buffer de entrada for inválido para a API.
    return "";
  }
}

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

/**
 * @fileoverview Fornece uma função para "limpar" um objeto, removendo chaves
 * com valores considerados vazios, nulos ou indesejados.
 */

/**
 * @summary Cria uma cópia "limpa" de um objeto, removendo chaves com valores vazios de forma segura e performática.
 *
 * @description
 * Itera sobre as chaves de um objeto (incluindo `Symbol`s) e retorna uma nova cópia contendo apenas as
 * chaves com valores considerados "válidos". Por padrão, `undefined`, `null`, strings vazias, arrays
 * vazios e objetos que se tornam vazios após a limpeza são removidos.
 * Tipos complexos como `Date` e `RegExp` são preservados como valores válidos.
 *
 * A função é segura contra referências circulares; estruturas cíclicas são interrompidas
 * e as propriedades que causam o ciclo são removidas do resultado final.
 *
 * @param {any} sourceObject - O objeto a ser limpo. Se não for um objeto "simples" (plain object), será retornado diretamente.
 * @param {object} [options={}] - Opções para customizar o comportamento da limpeza.
 * @property {boolean} [options.recursive=true] - Se `true`, a função será aplicada recursivamente a
 * objetos aninhados. Se `false`, objetos aninhados são mantidos como estão.
 * @property {boolean} [options.considerNullValue=false] - Se `false` (padrão), chaves com valor `null`
 * são removidas. Se `true`, são mantidas.
 * @property {boolean} [options.considerFalseValue=true] - Se `true` (padrão), chaves com valor `false`
 * são mantidas. Se `false`, são removidas.
 *
 * @returns {object|any} Um novo objeto "limpo" ou o valor original se a entrada não for um objeto.
 *
 * @example
 * // Exemplo com Symbol e RegExp
 * const sym = Symbol('id');
 * const complexObj = {
 * [sym]: 'valor-do-symbol',
 * regex: /abc/g,
 * a: 1,
 * b: null
 * };
 * const cleanedComplex = cleanObject(complexObj);
 * // Retorna: { [sym]: 'valor-do-symbol', regex: /abc/g, a: 1 }
 * console.log(cleanedComplex);
 */
function cleanObject(sourceObject, options = {}) {
  // O WeakMap rastreia os objetos já visitados para evitar ciclos infinitos.
  const cache = new WeakMap();

  // Função interna recursiva que faz o trabalho principal.
  function _clean(currentObject) {
    // Valores que não são "plain objects" (como Date, RegExp, arrays, primitivos)
    // são tratados como valores finais e não devem ser iterados.
    if (
      currentObject === null ||
      typeof currentObject !== 'object' ||
      currentObject.constructor !== Object
    ) {
      return currentObject;
    }
    
    // Se o objeto já foi visitado nesta chamada, é uma referência circular.
    // Retorna 'undefined' para que a chave que aponta para ele seja removida.
    if (cache.has(currentObject)) {
      return undefined;
    }

    const {
      recursive = true,
      considerNullValue = false,
      considerFalseValue = true,
    } = options || {};

    const newObj = {};
    // Adiciona o objeto ao cache antes de iterar para detectar ciclos que apontem para ele mesmo.
    cache.set(currentObject, newObj);

    // Usa-se Reflect.ownKeys para garantir que chaves do tipo Symbol sejam incluídas,
    // ao contrário de Object.keys ou for...in.
    for (const key of Reflect.ownKeys(currentObject)) {
      let value = currentObject[key];

      if (recursive) {
        value = _clean(value);
      }

      const isUndefined = value === undefined;
      const isNullAndIgnored = value === null && !considerNullValue;
      const isFalseAndIgnored = value === false && !considerFalseValue;
      const isEmptyString = value === '';
      const isEmptyArray = Array.isArray(value) && value.length === 0;
      
      // Um objeto que se tornou vazio após a limpeza recursiva também deve ser removido.
      const isEmptyObjectAfterCleaning = 
        value !== null &&
        typeof value === 'object' &&
        value.constructor === Object &&
        Reflect.ownKeys(value).length === 0;

      if (
        !isUndefined &&
        !isNullAndIgnored &&
        !isFalseAndIgnored &&
        !isEmptyString &&
        !isEmptyArray &&
        !isEmptyObjectAfterCleaning
      ) {
        newObj[key] = value;
      }
    }
    
    // Se o objeto resultante não tiver chaves, ele é considerado vazio.
    // Retorna `undefined` para que a chave que aponta para ele seja removida no nível pai.
    return Reflect.ownKeys(newObj).length > 0 ? newObj : undefined;
  }

  const result = _clean(sourceObject);

  // CORREÇÃO: Se o resultado final da limpeza do objeto de nível superior for `undefined`
  // (ou seja, ele ficou vazio), retorna `{}`, conforme esperado pelos testes.
  if (result === undefined && sourceObject?.constructor === Object) {
    return {};
  }

  return result;
}
// ------------------------------------------------------------------------------------------------

/**
 * @file Módulo utilitário para cópia profunda e manipulação de objetos.
 * @summary Fornece uma função `copyObject` para criar cópias profundas de objetos com opções de transformação.
 */


/**
 * @summary Cria uma cópia profunda (deep copy) de um objeto, com opções para excluir chaves e limpar valores vazios.
 *
 * @description
 * Esta função utiliza `lodash.clonedeep` para criar uma cópia robusta e totalmente independente do objeto de origem,
 * garantindo a imutabilidade. Após a cópia, ela permite duas transformações opcionais:
 * 1. **Exclusão de Chaves:** Remove propriedades especificadas na opção `exclude`.
 * 2. **Limpeza de Objeto:** Se a opção `cleanObject` for `true`, o resultado é passado por uma função de limpeza
 * para remover chaves com valores `undefined`, `null` ou vazios.
 *
 * @param {object} source - O objeto a ser copiado.
 * @param {object} [options={}] - Objeto de configuração para a operação de cópia.
 * @param {(string|symbol)[]} [options.exclude=[]] - Um array de chaves (string ou symbol) que devem ser omitidas da cópia final.
 * @param {boolean} [options.cleanObject=false] - Se `true`, o objeto copiado será passado pela função `cleanObject` para remover propriedades vazias.
 * @param {boolean} [options.throwsError=true] - Se `true`, a função lançará exceções em caso de parâmetros inválidos. Se `false`, retornará `null`.
 *
 * @returns {object | null} Retorna um **novo** objeto, profundamente copiado e opcionalmente modificado,
 * ou `null` se `throwsError` for `false` e ocorrer um erro.
 *
 * @throws {TypeError} Lança um erro se o `source` não for um objeto válido e `throwsError` for `true`.
 *
 * @example
 * // Exemplo 1: Cópia profunda simples
 * const original = { a: 1, b: { c: 2 } };
 * const copia = copyObject(original);
 * copia.b.c = 99;
 * // original.b.c ainda é 2.
 *
 * @example
 * // Exemplo 2: Cópia com exclusão de chaves
 * const user = { id: 123, name: 'John', password: 'abc' };
 * const safeUser = copyObject(user, { exclude: ['password'] });
 * // safeUser -> { id: 123, name: 'John' }
 *
 * @example
 * // Exemplo 3: Cópia com limpeza de objeto
 * const messyObject = { a: 1, b: null, c: undefined, d: 'hello', e: '' };
 * const clean = copyObject(messyObject, { cleanObject: true });
 * // clean -> { a: 1, d: 'hello' } (dependendo da implementação de cleanObject)
 *
 * @example
 * // Exemplo 4: Usando todas as opções
 * const fullObject = { id: 1, data: null, token: 'xyz', user: 'admin' };
 * const finalObject = copyObject(fullObject, { exclude: ['token'], cleanObject: true });
 * // finalObject -> { id: 1, user: 'admin' }
 */
function copyObject(source = {}, options = {}) {
  const {
    exclude = [],
    throwsError = true,
    cleanObject: shouldClean = false,
  } = options;

  // Validação do parâmetro de entrada principal.
  if (source === null || typeof source !== "object") {
    if (throwsError) {
      throw new TypeError(
        "copyObject: O parâmetro 'source' deve ser um objeto."
      );
    }
    return null;
  }

  try {
    // Etapa 1: A base da operação é uma cópia profunda e segura.
    let result = cloneDeep(source);

    // Etapa 2: Aplicar a lógica de exclusão, se aplicável.
    if (exclude.length > 0) {
      for (const key of exclude) {
        // A remoção é feita na cópia, não no objeto original.
        delete result[key];
      }
    }

    // Etapa 3: Aplicar a limpeza, se solicitado.
    if (shouldClean) {
      result = cleanObject(result);
    }

    return result;
  } catch (error) {
    // Captura de erro para respeitar a opção 'throwsError'.
    if (throwsError) {
      throw error;
    }
    return null;
  }
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para converter strings de moeda brasileira (BRL) para um número.
 */

/**
 * @summary Converte uma string de moeda no formato brasileiro (BRL) para um número de ponto flutuante.
 *
 * @description
 * Esta função analisa uma string que representa um valor monetário em Reais (ex: "R$ 1.234,56")
 * e a converte para um número puro (ex: 1234.56). Se a entrada já for um número válido,
 * ela é retornada diretamente.
 *
 * @param {string | number} moneyValue - O valor monetário a ser convertido.
 *
 * @returns {number | false} O número de ponto flutuante correspondente, ou `false` se a
 * conversão falhar ou a entrada for inválida.
 *
 * @example
 * currencyBRToFloat("R$ 1.234,56"); // Retorna 1234.56
 * currencyBRToFloat("1A23,45");      // Retorna false
 * currencyBRToFloat("");            // Retorna false
 * currencyBRToFloat(150.75);        // Retorna 150.75
 */
function currencyBRToFloat(moneyValue) {
  // 1. Validação de Entrada
  // Retorna `false` para entradas nulas ou indefinidas.
  if (moneyValue == null) {
    return false;
  }

  // Se a entrada já for um número válido, retorna-o diretamente.
  if (isNumber(moneyValue)) {
    return moneyValue;
  }

  // 2. Limpeza e Formatação da String
  const cleanedString = toString(moneyValue)
    // Remove o símbolo 'R$', espaços em branco e pontos (separador de milhar).
    .replace(/R\$|\s|\./g, "")
    // Substitui a vírgula (separador decimal brasileiro) por um ponto.
    .replace(",", ".");

  // 3. Validação de Caracteres Inválidos
  // Esta verificação impede que `parseFloat` interprete parcialmente uma string
  // inválida (ex: "1A2B" se tornaria 1). A regex `/[^0-9.]/` procura por
  // qualquer caractere que não seja um dígito (0-9) ou um ponto (.).
  if (/[^0-9.]/.test(cleanedString)) {
    return false;
  }

  // Se a string ficar vazia ou contiver apenas um ponto após a limpeza, é inválida.
  if (cleanedString === "" || cleanedString === ".") {
    return false;
  }
  
  // 4. Conversão e Validação Final
  const result = parseFloat(cleanedString);

  // Verifica se o resultado do `parseFloat` é um número finito.
  if (isNumber(result)) {
    return result;
  }

  // Se a conversão falhou, retorna `false`.
  return false;
}

/**
 * @fileoverview Centraliza constantes de formatação e padrões para uso geral na aplicação.
 * @description Este módulo exporta formatos de data, máscaras para documentos brasileiros, e
 * expressões regulares (Regex) para validações de formato.
 */

// ==============================================================================================
// SEÇÃO: Formatos de Data (para bibliotecas como date-fns, dayjs, etc.)
// ==============================================================================================

// ----------------------------------------------------------------------------------------------
// Padrões de Data ISO 8601

/**
 * Formato de data ISO 8601 completo com timezone (UTC/Zulu).
 * @example "2025-08-18T20:49:08.123Z"
 */
const DATE_ISO_FORMAT_TZ = `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`;

/**
 * Formato de data ISO 8601 sem informação de timezone.
 * @example "2025-08-18T20:49:08.123"
 */
const DATE_ISO_FORMAT = `yyyy-MM-dd'T'HH:mm:ss.SSS`;

// ----------------------------------------------------------------------------------------------
// Padrões de Data Brasileiros

/**
 * Formato de data brasileiro (dia-mês-ano) separado por hífen.
 * @example "18-08-2025"
 */
const DATE_BR_FORMAT_D = `dd-MM-yyyy`;

/**
 * Formato de data brasileiro (dia/mês/ano) separado por barra.
 * @example "18/08/2025"
 */
const DATE_BR_FORMAT_FS = `dd/MM/yyyy`;

/**
 * Formato de data e hora brasileiro separado por hífen.
 * @example "18-08-2025 20:49:08"
 */
const DATE_BR_HOUR_FORMAT_D = `dd-MM-yyyy HH:mm:ss`;

/**
 * Formato de data e hora brasileiro separado por barra.
 * @example "18/08/2025 20:49:08"
 */
const DATE_BR_HOUR_FORMAT_FS = `dd/MM/yyyy HH:mm:ss`;

/**
 * Formato de data brasileiro (mês-ano) separado por hífen.
 * @example "08-2025"
 */
const DATE_BR_MONTH_FORMAT_D = `MM-yyyy`;

/**
 * Formato de data brasileiro (mês/ano) separado por barra.
 * @example "08/2025"
 */
const DATE_BR_MONTH_FORMAT_FS = `MM/yyyy`;

// ----------------------------------------------------------------------------------------------
// Padrões de Data Americanos

/**
 * Formato de data americano (ano-mês-dia) separado por hífen.
 * @example "2025-08-18"
 */
const DATE_EUA_FORMAT_D = `yyyy-MM-dd`;

/**
 * Formato de data americano (ano/mês/dia) separado por barra.
 * @example "2025/08/18"
 */
const DATE_EUA_FORMAT_FS = `yyyy/MM/dd`;

/**
 * Formato de data e hora americano separado por hífen.
 * @example "2025-08-18 20:49:08"
 */
const DATE_EUA_HOUR_FORMAT_D = `yyyy-MM-dd HH:mm:ss`;

/**
 * Formato de data e hora americano separado por barra.
 * @example "2025/08/18 20:49:08"
 */
const DATE_EUA_HOUR_FORMAT_FS = `yyyy/MM/dd HH:mm:ss`;

/**
 * Formato de data americano (ano-mês) separado por hífen.
 * @example "2025-08"
 */
const DATE_EUA_MONTH_FORMAT_D = `yyyy-MM`;

/**
 * Formato de data americano (ano/mês) separado por barra.
 * @example "2025/08"
 */
const DATE_EUA_MONTH_FORMAT_FS = `yyyy/MM`;

// ==============================================================================================
// SEÇÃO: Máscaras de Formatação (para bibliotecas de input mask)
// ==============================================================================================

/**
 * Máscara para CAD/ICMS do estado do Paraná (PR).
 * @example "90312851-11"
 */
const STRING_FORMAT_CADICMSPR = "########-##";

/**
 * Máscara para CNPJ alfanumérico.
 * 'S' representa um caractere alfanumérico [A-Z0-9] e '#' um dígito [0-9].
 * @example "AB.123.CD4/567E-89"
 */
const STRING_FORMAT_CNPJ = "##.###.###/####-##";

/**
 * Máscara para CNPJ Raiz alfanumérico.
 * 'S' representa um caractere alfanumérico [A-Z0-9] e '#' um dígito [0-9].
 * @example "AB.123.CD4"
 */
const STRING_FORMAT_CNPJ_RAIZ = "##.###.###";

/**
 * Máscara para CPF.
 * @example "123.456.789-00"
 */
const STRING_FORMAT_CPF = "###.###.###-##";

/**
 * Máscara para Protocolo do estado do Paraná (PR).
 * @example "123.456.789.1"
 */
const STRING_FORMAT_PROTOCOLPR = "###.###.###.#";

/**
 * Máscara para CEP (Código de Endereçamento Postal).
 * @example "80000-000"
 */
const STRING_FORMAT_CEP = "#####-###";

/**
 * Máscara para Telefone Celular com 9 dígitos + DDD.
 * @example "(41) 98888-8888"
 */
const STRING_FORMAT_PHONE = "(##) # ####-####";

// ==============================================================================================
// SEÇÃO: Expressões Regulares (Regex) para Validação de Formato
// ==============================================================================================

/**
 * Regex para validar a estrutura de um CNPJ alfanumérico.
 * Verifica 12 caracteres alfanuméricos seguidos de 2 dígitos numéricos. Case-insensitive.
 */
const REGEX_CNPJ_ALPHANUMERIC = /^([A-Z\d]){12}(\d){2}$/i;

/**
 * Regex para validar um e-mail em formato padrão.
 */
const REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Regex para validar um UUID v4 (usado em Chave Aleatória PIX).
 */
const REGEX_UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Regex para validar um número de telefone brasileiro, com ou sem o código do país (+55).
 * Aceita números de 10 (fixo) ou 11 (celular) dígitos, além do DDI.
 * @example /^(?:\+55)?\d{10,11}$/
 */
const REGEX_PHONE_BR = /^(?:\+55)?\d{10,11}$/;

// ==============================================================================================
// SEÇÃO: Dados Geográficos - Brasil
// ==============================================================================================

/**
 * Objeto (chave-valor) com as siglas e nomes de todos os estados brasileiros e o Distrito Federal.
 * @example { "PR": "Paraná", "SP": "São Paulo", ... }
 */
const BRAZILIAN_STATES = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

/**
 * Array com as siglas de todos os estados brasileiros e o Distrito Federal.
 * Útil para popular seletores (dropdowns) ou para validações.
 * @example ["AC", "AL", "AP", ...]
 */
const BRAZILIAN_STATES_ABBR = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

// Default export para compatibilidade
var constants$1 = {
  // Formatos de Data ISO 8601
  DATE_ISO_FORMAT_TZ,
  DATE_ISO_FORMAT,
  
  // Formatos de Data Brasileiros
  DATE_BR_FORMAT_D,
  DATE_BR_FORMAT_FS,
  DATE_BR_HOUR_FORMAT_D,
  DATE_BR_HOUR_FORMAT_FS,
  DATE_BR_MONTH_FORMAT_D,
  DATE_BR_MONTH_FORMAT_FS,
  
  // Formatos de Data Americanos
  DATE_EUA_FORMAT_D,
  DATE_EUA_FORMAT_FS,
  DATE_EUA_HOUR_FORMAT_D,
  DATE_EUA_HOUR_FORMAT_FS,
  DATE_EUA_MONTH_FORMAT_D,
  DATE_EUA_MONTH_FORMAT_FS,
  
  // Máscaras de Formatação
  STRING_FORMAT_CADICMSPR,
  STRING_FORMAT_CNPJ,
  STRING_FORMAT_CNPJ_RAIZ,
  STRING_FORMAT_CPF,
  STRING_FORMAT_PROTOCOLPR,
  STRING_FORMAT_CEP,
  STRING_FORMAT_PHONE,
  
  // Expressões Regulares
  REGEX_CNPJ_ALPHANUMERIC,
  REGEX_EMAIL,
  REGEX_UUID_V4,
  REGEX_PHONE_BR,
  
  // Dados Geográficos
  BRAZILIAN_STATES,
  BRAZILIAN_STATES_ABBR,
};

declare const constantsNamespace_BRAZILIAN_STATES: typeof BRAZILIAN_STATES;
declare const constantsNamespace_BRAZILIAN_STATES_ABBR: typeof BRAZILIAN_STATES_ABBR;
declare const constantsNamespace_DATE_BR_FORMAT_D: typeof DATE_BR_FORMAT_D;
declare const constantsNamespace_DATE_BR_FORMAT_FS: typeof DATE_BR_FORMAT_FS;
declare const constantsNamespace_DATE_BR_HOUR_FORMAT_D: typeof DATE_BR_HOUR_FORMAT_D;
declare const constantsNamespace_DATE_BR_HOUR_FORMAT_FS: typeof DATE_BR_HOUR_FORMAT_FS;
declare const constantsNamespace_DATE_BR_MONTH_FORMAT_D: typeof DATE_BR_MONTH_FORMAT_D;
declare const constantsNamespace_DATE_BR_MONTH_FORMAT_FS: typeof DATE_BR_MONTH_FORMAT_FS;
declare const constantsNamespace_DATE_EUA_FORMAT_D: typeof DATE_EUA_FORMAT_D;
declare const constantsNamespace_DATE_EUA_FORMAT_FS: typeof DATE_EUA_FORMAT_FS;
declare const constantsNamespace_DATE_EUA_HOUR_FORMAT_D: typeof DATE_EUA_HOUR_FORMAT_D;
declare const constantsNamespace_DATE_EUA_HOUR_FORMAT_FS: typeof DATE_EUA_HOUR_FORMAT_FS;
declare const constantsNamespace_DATE_EUA_MONTH_FORMAT_D: typeof DATE_EUA_MONTH_FORMAT_D;
declare const constantsNamespace_DATE_EUA_MONTH_FORMAT_FS: typeof DATE_EUA_MONTH_FORMAT_FS;
declare const constantsNamespace_DATE_ISO_FORMAT: typeof DATE_ISO_FORMAT;
declare const constantsNamespace_DATE_ISO_FORMAT_TZ: typeof DATE_ISO_FORMAT_TZ;
declare const constantsNamespace_REGEX_CNPJ_ALPHANUMERIC: typeof REGEX_CNPJ_ALPHANUMERIC;
declare const constantsNamespace_REGEX_EMAIL: typeof REGEX_EMAIL;
declare const constantsNamespace_REGEX_PHONE_BR: typeof REGEX_PHONE_BR;
declare const constantsNamespace_REGEX_UUID_V4: typeof REGEX_UUID_V4;
declare const constantsNamespace_STRING_FORMAT_CADICMSPR: typeof STRING_FORMAT_CADICMSPR;
declare const constantsNamespace_STRING_FORMAT_CEP: typeof STRING_FORMAT_CEP;
declare const constantsNamespace_STRING_FORMAT_CNPJ: typeof STRING_FORMAT_CNPJ;
declare const constantsNamespace_STRING_FORMAT_CNPJ_RAIZ: typeof STRING_FORMAT_CNPJ_RAIZ;
declare const constantsNamespace_STRING_FORMAT_CPF: typeof STRING_FORMAT_CPF;
declare const constantsNamespace_STRING_FORMAT_PHONE: typeof STRING_FORMAT_PHONE;
declare const constantsNamespace_STRING_FORMAT_PROTOCOLPR: typeof STRING_FORMAT_PROTOCOLPR;
declare namespace constantsNamespace {
  export { constantsNamespace_BRAZILIAN_STATES as BRAZILIAN_STATES, constantsNamespace_BRAZILIAN_STATES_ABBR as BRAZILIAN_STATES_ABBR, constantsNamespace_DATE_BR_FORMAT_D as DATE_BR_FORMAT_D, constantsNamespace_DATE_BR_FORMAT_FS as DATE_BR_FORMAT_FS, constantsNamespace_DATE_BR_HOUR_FORMAT_D as DATE_BR_HOUR_FORMAT_D, constantsNamespace_DATE_BR_HOUR_FORMAT_FS as DATE_BR_HOUR_FORMAT_FS, constantsNamespace_DATE_BR_MONTH_FORMAT_D as DATE_BR_MONTH_FORMAT_D, constantsNamespace_DATE_BR_MONTH_FORMAT_FS as DATE_BR_MONTH_FORMAT_FS, constantsNamespace_DATE_EUA_FORMAT_D as DATE_EUA_FORMAT_D, constantsNamespace_DATE_EUA_FORMAT_FS as DATE_EUA_FORMAT_FS, constantsNamespace_DATE_EUA_HOUR_FORMAT_D as DATE_EUA_HOUR_FORMAT_D, constantsNamespace_DATE_EUA_HOUR_FORMAT_FS as DATE_EUA_HOUR_FORMAT_FS, constantsNamespace_DATE_EUA_MONTH_FORMAT_D as DATE_EUA_MONTH_FORMAT_D, constantsNamespace_DATE_EUA_MONTH_FORMAT_FS as DATE_EUA_MONTH_FORMAT_FS, constantsNamespace_DATE_ISO_FORMAT as DATE_ISO_FORMAT, constantsNamespace_DATE_ISO_FORMAT_TZ as DATE_ISO_FORMAT_TZ, constantsNamespace_REGEX_CNPJ_ALPHANUMERIC as REGEX_CNPJ_ALPHANUMERIC, constantsNamespace_REGEX_EMAIL as REGEX_EMAIL, constantsNamespace_REGEX_PHONE_BR as REGEX_PHONE_BR, constantsNamespace_REGEX_UUID_V4 as REGEX_UUID_V4, constantsNamespace_STRING_FORMAT_CADICMSPR as STRING_FORMAT_CADICMSPR, constantsNamespace_STRING_FORMAT_CEP as STRING_FORMAT_CEP, constantsNamespace_STRING_FORMAT_CNPJ as STRING_FORMAT_CNPJ, constantsNamespace_STRING_FORMAT_CNPJ_RAIZ as STRING_FORMAT_CNPJ_RAIZ, constantsNamespace_STRING_FORMAT_CPF as STRING_FORMAT_CPF, constantsNamespace_STRING_FORMAT_PHONE as STRING_FORMAT_PHONE, constantsNamespace_STRING_FORMAT_PROTOCOLPR as STRING_FORMAT_PROTOCOLPR, constants$1 as default };
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para formatar objetos Date em strings usando date-fns.
 */

/**
 * @summary Formata um objeto Date em uma string, com base em um padrão de formato.
 *
 * @description
 * Esta função atua como um wrapper seguro para a função `format` da biblioteca `date-fns`.
 * Ela adiciona uma camada de validação robusta para garantir que apenas objetos `Date`
 * válidos sejam passados para a função de formatação, prevenindo erros.
 *
 * @param {Date} date - O objeto `Date` a ser formatado.
 * @param {string} [stringFormat=DATE_BR_FORMAT_D] - O padrão de formatação, compatível
 * com `date-fns`. O padrão no Brasil é 'dd/MM/yyyy'.
 *
 * @returns {string | false} A string da data formatada, ou `false` se a entrada
 * não for um objeto `Date` válido.
 *
 * @example
 * const myDate = new Date('2025-08-21T15:30:45');
 * dateToFormat(myDate); // "21/08/2025" (usando o padrão)
 * dateToFormat(myDate, 'yyyy-MM-dd HH:mm:ss.SSS'); // "2025-08-21 15:30:45.000"
 * dateToFormat('texto invalido'); // false
 */
function dateToFormat(date, stringFormat = DATE_BR_FORMAT_D) {
  // 1. Validação do tipo e do valor da data.
  // A checagem `isNaN` trata casos como `new Date('data inválida')`.
  if (!isInstanceOf(date, Date) || isNaN(date.getTime())) {
    // Retorna o booleano `false` para manter a consistência com os testes do projeto.
    return false;
  }

  // 2. Delega a formatação para a função `format` da biblioteca `date-fns`.
  // Isso garante suporte completo a todos os tokens de formato que a biblioteca oferece.
  return format(date, stringFormat);
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para obter o início de um dia a partir de um objeto Date.
 */

/**
 * @summary Retorna uma nova data representando o início do dia (00:00:00).
 *
 * @description
 * Esta função recebe um objeto `Date` e retorna um **novo** objeto `Date` ajustado para o
 * primeiro momento daquele dia (00:00:00.000), no fuso horário local.
 *
 * A função é **não-mutável**, o que significa que o objeto `Date` original passado como
 * argumento não é modificado.
 *
 * @param {Date} date - O objeto `Date` de referência.
 *
 * @returns {Date | false} Um novo objeto `Date` representando o início do dia, ou `false`
 * se a entrada não for um objeto `Date` válido.
 *
 * @example
 * const dataOriginal = new Date('2025-08-21T15:30:00');
 * const inicioDoDia = dateFirstHourOfDay(dataOriginal); // Retorna um novo objeto Date
 *
 * const invalido = dateFirstHourOfDay('não é uma data'); // Retorna false
 */
function dateFirstHourOfDay(date) {
  // 1. Validação do tipo e do valor da data.
  // A checagem `isNaN` trata casos como `new Date('data inválida')`.
  if (!isInstanceOf(date, Date) || isNaN(date.getTime())) {
    // Retorna `false` para alinhar com o comportamento esperado pelos testes.
    return false;
  }

  // 2. Cria uma nova instância da data para evitar a mutação do objeto original.
  const newDate = new Date(date.getTime());

  // 3. Define a hora, minutos, segundos e milissegundos para zero de uma só vez.
  // `setHours(0, 0, 0, 0)` é uma forma concisa e eficiente de zerar o tempo do dia.
  newDate.setHours(0, 0, 0, 0);

  return newDate;
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para obter o final de um dia a partir de um objeto Date.
 */

/**
 * @summary Retorna uma nova data representando o final do dia (23:59:59.999).
 *
 * @description
 * Esta função recebe um objeto `Date` e retorna um **novo** objeto `Date` ajustado para o
 * último momento daquele dia (23:59:59.999), no fuso horário local.
 *
 * A função é **não-mutável**, o que significa que o objeto `Date` original passado como
 * argumento não é modificado.
 *
 * @param {Date} date - O objeto `Date` de referência.
 *
 * @returns {Date | false} Um novo objeto `Date` representando o final do dia, ou `false`
 * se a entrada não for um objeto `Date` válido.
 *
 * @example
 * const dataOriginal = new Date('2025-08-21T15:30:00');
 * const finalDoDia = dateLastHourOfDay(dataOriginal);
 *
 * // O objeto original permanece inalterado
 * console.log(dataOriginal.toLocaleTimeString()); // "15:30:00"
 *
 * // O novo objeto representa o final daquele dia
 * console.log(finalDoDia.toLocaleTimeString());  // "23:59:59"
 */
function dateLastHourOfDay(date) {
  // 1. Validação do tipo e do valor da data.
  // A checagem `isNaN` trata casos como `new Date('data inválida')`.
  if (!isInstanceOf(date, Date) || isNaN(date.getTime())) {
    return false;
  }

  // 2. Cria uma nova instância da data para evitar a mutação do objeto original.
  const newDate = new Date(date.getTime());

  // 3. Define a hora para o último momento do dia.
  // `setHours` pode receber todos os valores de tempo, tornando o código mais conciso.
  newDate.setHours(23, 59, 59, 999);

  return newDate;
}

/**
 * @file Utilitário para criar uma função "debounced".
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

/**
 * @file Utilitário para remover chaves de um objeto de forma não-mutável.
 */

/**
 * @summary Cria um novo objeto omitindo um conjunto de chaves especificadas.
 *
 * @description
 * Esta função recebe um objeto e um array de chaves, e retorna um **novo** objeto
 * contendo todas as propriedades do objeto original, exceto aquelas especificadas
 * no array de chaves.
 *
 * A função é **não-mutável**, o que significa que o objeto original passado como
 * argumento não é modificado.
 *
 * @param {object} [object={}] - O objeto de origem.
 * @param {string[]} [keys=[]] - Um array com os nomes (string) das chaves a serem omitidas.
 *
 * @returns {object} Um novo objeto sem as chaves especificadas.
 *
 * @example
 * const user = {
 * id: 123,
 * name: 'Arthur',
 * email: 'arthur@example.com',
 * password: 'supersecret'
 * };
 *
 * const publicUser = deleteKeys(user, ['password', 'email']);
 *
 * console.log(publicUser); // { id: 123, name: 'Arthur' }
 * console.log(user);       // O objeto original permanece inalterado
 */
function deleteKeys(object = {}, keys = []) {
  // 1. Validação da entrada.
  if (!isObject(object)) {
    return object;
  }
  if (!Array.isArray(keys)) {
    // Retorna uma cópia rasa se o array de chaves for inválido, garantindo a não-mutação.
    return { ...object };
  }

  // 2. Cria uma cópia rasa do objeto para evitar a mutação do original.
  const newObject = { ...object };

  // 3. Itera sobre as chaves a serem removidas e as deleta da CÓPIA.
  for (const key of keys) {
    delete newObject[key];
  }

  // 4. Retorna o novo objeto modificado.
  return newObject;
}

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

/**
 * @file Utilitário para gerar strings aleatórias seguras.
 */

// Define os conjuntos de caracteres como constantes para clareza e reutilização.
const CHAR_SETS = {
  LOWERCASE: 'abcdefghijklmnopqrstuvwxyz',
  UPPERCASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  ACCENTED: 'àáâãçèéêìíîðñòóôõùúûý',
  DIGITS: '0123456789',
  SYMBOLS: '!@#$%^&*-_+=;:,.<>?'
};

/**
 * @summary Gera uma string aleatória criptograficamente segura.
 *
 * @description
 * Esta função gera uma string aleatória com um tamanho especificado, usando um conjunto de
 * caracteres customizável. Ela utiliza a Web Crypto API (`crypto.getRandomValues`),
 * que está disponível em navegadores modernos e no Node.js, para garantir que os
 * caracteres sejam selecionados de forma segura e imprevisível, tornando-a adequada
 * para gerar senhas, tokens ou outros valores sensíveis.
 *
 * @param {number} [size=32] - O comprimento da string a ser gerada.
 * @param {object} [options={}] - Opções para customizar o conjunto de caracteres.
 * @param {boolean} [options.excludeLowerCaseChars=false] - Excluir caracteres minúsculos.
 * @param {boolean} [options.excludeUpperCaseChars=false] - Excluir caracteres maiúsculos.
 * @param {boolean} [options.excludeAccentedChars=false] - Excluir caracteres acentuados.
 * @param {boolean} [options.excludeDigits=false] - Excluir dígitos numéricos.
 * @param {boolean} [options.excludeSymbols=false] - Excluir símbolos padrão.
 * @param {string} [options.includeSymbols=""] - Uma string com símbolos adicionais
 * para incluir no conjunto de caracteres.
 *
 * @returns {string} A string aleatória gerada.
 */
function generateRandomString(size = 32, options = {}) {
  // 1. Define as opções padrão e as mescla com as fornecidas pelo usuário.
  // Isso garante que o envio de opções parciais (ex: { excludeDigits: true }) funcione corretamente.
  const defaultOptions = {
    excludeLowerCaseChars: false,
    excludeUpperCaseChars: false,
    excludeAccentedChars: false,
    excludeDigits: false,
    excludeSymbols: false,
    includeSymbols: ""
  };
  const finalOptions = { ...defaultOptions, ...options };

  // 2. Constrói a string de caracteres válidos com base nas opções.
  let validChars = finalOptions.includeSymbols;
  if (!finalOptions.excludeLowerCaseChars) validChars += CHAR_SETS.LOWERCASE;
  if (!finalOptions.excludeUpperCaseChars) validChars += CHAR_SETS.UPPERCASE;
  if (!finalOptions.excludeAccentedChars) validChars += CHAR_SETS.ACCENTED;
  if (!finalOptions.excludeDigits) validChars += CHAR_SETS.DIGITS;
  if (!finalOptions.excludeSymbols) validChars += CHAR_SETS.SYMBOLS;

  // Se não houver caracteres válidos ou o tamanho for zero, retorna uma string vazia.
  if (validChars.length === 0 || size <= 0) {
    return "";
  }

  // 3. Gera a string aleatória usando uma fonte criptograficamente segura.
  const randomValues = new Uint32Array(size);
  // `crypto.getRandomValues` preenche o array com números aleatórios seguros.
  // `globalThis` garante compatibilidade entre Node.js, navegadores e web workers.
  globalThis.crypto.getRandomValues(randomValues);

  let result = [];
  for (let i = 0; i < size; i++) {
    // Usa o operador de módulo para mapear o número aleatório a um índice válido.
    const randomIndex = randomValues[i] % validChars.length;
    result.push(validChars[randomIndex]);
  }

  return result.join('');
}

/**
 * @file Utilitário de alta precisão para medir o tempo de execução.
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

/**
 * @file Utilitário seguro para analisar (parse) strings JSON.
 */

/**
 * @summary Analisa uma string JSON de forma segura, com controle sobre o lançamento de erros.
 *
 * @description
 * Esta função é um wrapper para `JSON.parse()` que simplifica o tratamento de erros.
 * Em vez de precisar envolver cada chamada em um bloco `try...catch`, você pode
 * controlar o comportamento em caso de falha através do parâmetro `throwsError`.
 *
 * @param {string} text - A string JSON a ser analisada.
 * @param {boolean} [throwsError=true] - Se `true`, a função lançará uma exceção em caso de
 * JSON inválido (comportamento padrão de `JSON.parse`). Se `false`, retornará `null`.
 *
 * @returns {any | null} O valor ou objeto JavaScript resultante da análise, ou `null` se
 * a análise falhar e `throwsError` for `false`. `JSON.parse` pode retornar qualquer
 * tipo de dado JSON válido (objetos, arrays, strings, números, etc.).
 *
 * @throws {SyntaxError | TypeError} Lança um `TypeError` se a entrada não for uma string,
 * ou um `SyntaxError` se a string for um JSON inválido (e `throwsError` for `true`).
 *
 * @example
 * const jsonValido = '{"id": 1, "name": "Arthur"}';
 * const jsonInvalido = '{"id": 1, name: "Arthur"}'; // `name` sem aspas
 *
 * // Comportamento seguro (retorna null em caso de erro)
 * const resultado = JSONFrom(jsonInvalido, false);
 * console.log(resultado); // null
 *
 * // Comportamento padrão (lança erro)
 * try {
 * JSONFrom(jsonInvalido, true);
 * } catch (e) {
 * console.error(e.message); // Unexpected token n in JSON at position 11...
 * }
 *
 * const objeto = JSONFrom(jsonValido);
 * console.log(objeto.name); // "Arthur"
 */
function JSONFrom(text, throwsError = true) {
  // 1. Validação do tipo de entrada. `JSON.parse` espera uma string.
  if (typeof text !== "string") {
    if (throwsError) {
      throw new TypeError("A entrada para JSONFrom deve ser uma string.");
    }
    return null;
  }

  try {
    // 2. Tenta analisar a string.
    return JSON.parse(text);
  } catch (error) {
    // 3. Lida com erros de análise com base na opção fornecida.
    if (throwsError) {
      // Re-lança o erro original de `JSON.parse`.
      throw error;
    }

    // Se os erros não devem ser lançados, retorna null.
    return null;
  }
}

/**
 * @file Utilitário seguro para converter valores JavaScript em strings JSON.
 */

/**
 * @summary Converte um valor JavaScript para uma string JSON de forma segura.
 *
 * @description
 * Esta função é um wrapper para `JSON.stringify()` que simplifica o tratamento de erros.
 * `JSON.stringify` pode lançar uma exceção ao tentar serializar estruturas com
 * referências circulares ou valores `BigInt`. Esta função permite capturar esses erros
 * e retornar `null` em vez de quebrar a execução do programa.
 *
 * @param {any} object - O valor JavaScript (objeto, array, primitivo, etc.) a ser convertido.
 * @param {boolean} [throwsError=true] - Se `true`, a função lançará uma exceção em caso de
 * erro na serialização. Se `false`, retornará `null`.
 *
 * @returns {string | null} A string JSON resultante, ou `null` se a serialização falhar e
 * `throwsError` for `false`.
 *
 * @throws {TypeError} Lança um `TypeError` se o valor contiver referências circulares
 * ou um `BigInt` (e `throwsError` for `true`).
 *
 * @example
 * const user = { id: 1, name: 'Arthur' };
 * const jsonString = JSONTo(user);
 * console.log(jsonString); // '{"id":1,"name":"Arthur"}'
 *
 * // Exemplo com referência circular, que normalmente quebraria a aplicação
 * const obj = { name: 'obj' };
 * obj.self = obj;
 *
 * // Comportamento seguro (retorna null)
 * const resultado = JSONTo(obj, false);
 * console.log(resultado); // null
 *
 * // Comportamento padrão (lança erro)
 * try {
 * JSONTo(obj, true);
 * } catch (e) {
 * console.error(e.message); // Ex: "Converting circular structure to JSON..."
 * }
 */
function JSONTo(object = {}, throwsError = true) {
  try {
    // 1. Tenta converter o valor para uma string JSON.
    return JSON.stringify(object);
  } catch (error) {
    // 2. Lida com erros de serialização (ex: referências circulares).
    if (throwsError) {
      // Re-lança o erro original, mantendo o comportamento padrão do JavaScript.
      throw error;
    }

    // Se os erros não devem ser lançados, retorna null.
    return null;
  }
}

// ------------------------------------------------------------------------------------------------
// Internal state — holds the injected crypto module when set externally.
// Initialized as null to indicate no override has been provided.
// Shared exclusively within this module — never exported directly.
let _injectedCrypto = null;

// ------------------------------------------------------------------------------------------------

/**
 * Injects an external cryptographic module to override the automatic environment
 * detection performed by {@link getCrypto}.
 *
 * This function is intended for environments where dynamic module loading is
 * unavailable or unreliable — such as ESM contexts in Node.js where `require`
 * is not defined. By injecting the native `crypto` module explicitly, the caller
 * bypasses the internal detection logic entirely.
 *
 * Once set, any subsequent call to {@link getCrypto} will return the injected
 * module instead of performing environment detection.
 *
 * Pass `null` to clear the injection and restore automatic detection behavior.
 *
 * @param {Crypto|Object|null} cryptoModule - The cryptographic module to inject.
 *                                            Must expose the same interface expected
 *                                            by the consuming functions (e.g. createHash,
 *                                            publicEncrypt, privateDecrypt for Node.js,
 *                                            or subtle for browser Web Crypto API).
 *                                            Pass `null` to reset to automatic detection.
 * @returns {void}
 *
 * @throws {Error} When the provided value is neither a non-null object nor null —
 *                 prevents silent failures from invalid injections such as strings
 *                 or numeric values.
 *
 * @example
 * // Node.js ESM — inject native crypto to avoid dynamic require issues
 * import crypto from "crypto";
 * import { setCrypto } from "misc-helpers";
 *
 * setCrypto(crypto);
 *
 * @example
 * // Browser — inject Web Crypto API explicitly
 * import { setCrypto } from "misc-helpers";
 *
 * setCrypto(window.crypto);
 *
 * @example
 * // Reset to automatic detection
 * import { setCrypto } from "misc-helpers";
 *
 * setCrypto(null);
 */
function setCrypto(cryptoModule) {
  if (cryptoModule !== null && typeof cryptoModule !== "object") {
    throw new Error(
      `setCrypto: expected a crypto module object or null, received ${typeof cryptoModule}`,
    );
  }

  _injectedCrypto = cryptoModule;
}

// ------------------------------------------------------------------------------------------------

/**
 * Retrieves the appropriate cryptographic module for the current environment.
 *
 * This function first checks whether an external module has been injected via
 * {@link setCrypto}. If so, it returns the injected module immediately, bypassing
 * all environment detection logic. This is the recommended approach for Node.js
 * ESM contexts where dynamic `require` is unavailable.
 *
 * When no injection is present, environment detection is performed automatically:
 * browser environments are identified by the presence of `window.crypto`, while
 * Node.js environments fall back to dynamic loading of the native `crypto` module
 * through multiple compatibility strategies.
 *
 * @returns {Crypto|Object} The cryptographic module appropriate for the current environment:
 *                          - Injected: Returns the module provided via {@link setCrypto}
 *                          - Browser:  Returns `window.crypto` (Web Crypto API)
 *                          - Node.js:  Returns the native `crypto` module
 *
 * @throws {Error} When cryptographic capabilities are unavailable:
 *                 - Browser: When `window.crypto` is undefined (typically HTTP contexts)
 *                 - Node.js: When all loading strategies fail and no injection has been
 *                            provided via {@link setCrypto}
 *
 * @example
 * // Recommended — Node.js ESM, inject before calling getCrypto
 * import crypto from "crypto";
 * import { setCrypto, getCrypto } from "misc-helpers";
 *
 * setCrypto(crypto);
 * const cryptoModule = getCrypto(); // returns the injected module
 *
 * @example
 * // Browser environment — Web Crypto API usage
 * const crypto = getCrypto();
 * const encoder = new TextEncoder();
 * const data = encoder.encode('hello world');
 * crypto.subtle.digest('SHA-256', data).then(hash => {
 *   console.log(new Uint8Array(hash));
 * });
 *
 * @example
 * // Node.js environment without injection — dynamic require fallback
 * const crypto = getCrypto();
 * const hash = crypto.createHash('sha256')
 *   .update('hello world', 'utf8')
 *   .digest('hex');
 * console.log(hash);
 *
 * @example
 * // Universal usage pattern with error handling
 * try {
 *   const crypto = getCrypto();
 *   // Use crypto based on environment capabilities
 * } catch (error) {
 *   console.error('Cryptographic module unavailable:', error.message);
 * }
 */
function getCrypto() {
  // Injected module takes precedence — bypasses all detection logic.
  // Use setCrypto() before any call in ESM environments where require is unavailable.
  if (_injectedCrypto !== null) {
    return _injectedCrypto;
  }

  // Check for browser environment by testing window object availability
  if (typeof window !== "undefined" && typeof window.crypto !== "undefined") {
    return window.crypto;
  }

  // Server-side environment detected — try all available methods to load
  // the Node.js crypto module for maximum compatibility across CJS, ESM and bundlers
  try {
    // Method 1: CommonJS or bundler environment — require is available globally
    if (typeof require !== "undefined") {
      return require("crypto");
    }

    // Method 2: ESM in Node.js with createRequire — manually construct require
    if (typeof module !== "undefined" && module.createRequire) {
      const require = module.createRequire(import.meta.url);
      return require("crypto");
    }

    // Method 3: All dynamic methods failed — ESM pure environment with no require.
    // Caller must inject the module explicitly via setCrypto() before any call.
    throw new Error(
      "No method available to load crypto module in current environment — " +
      "call setCrypto(crypto) before using this module in ESM environments",
    );
  } catch (error) {
    throw new Error(`Failed to load crypto module: ${error.message}`);
  }
}

// ------------------------------------------------------------------------------------------------

/**
 * Imports cryptographic keys using the Web Crypto API in a cross-platform manner.
 *
 * This function provides a unified interface for importing cryptographic keys across
 * different environments (browser and Node.js). It handles the environment-specific
 * crypto module retrieval and delegates the actual key import operation to the
 * appropriate Web Crypto API implementation.
 *
 * The function supports all standard key formats and algorithms supported by the
 * Web Crypto API, including RSA, ECDSA, ECDH, AES, and HMAC keys.
 *
 * @param {string} format - The data format of the key to import. Supported values:
 *                          - 'raw': Raw key data (typically for symmetric keys)
 *                          - 'spki': SubjectPublicKeyInfo format (for public keys)
 *                          - 'pkcs8': PKCS #8 format (for private keys)
 *                          - 'jwk': JSON Web Key format
 *
 * @param {BufferSource|ArrayBuffer|Uint8Array|Object} keyData - The key material to import:
 *                          - For 'raw', 'spki', 'pkcs8': BufferSource (ArrayBuffer, Uint8Array, etc.)
 *                          - For 'jwk': JavaScript object representing the JSON Web Key
 *
 * @param {Object|string} algorithm - Algorithm specification for the key:
 *                          - Object: Detailed algorithm parameters (e.g., { name: 'RSA-PSS', hash: 'SHA-256' })
 *                          - String: Simple algorithm name (e.g., 'AES-GCM', 'RSA-OAEP')
 *
 * @param {boolean} extractable - Key extractability flag:
 *                          - true: Key can be exported using crypto.subtle.exportKey()
 *                          - false: Key cannot be extracted (more secure for sensitive keys)
 *
 * @param {string[]} keyUsages - Array of permitted key operations:
 *                          - 'encrypt', 'decrypt': For encryption/decryption operations
 *                          - 'sign', 'verify': For digital signature operations
 *                          - 'deriveKey', 'deriveBits': For key derivation operations
 *                          - 'wrapKey', 'unwrapKey': For key wrapping operations
 *
 * @returns {Promise<CryptoKey>} Promise resolving to the imported CryptoKey object.
 *                          The CryptoKey can be used with other Web Crypto API methods
 *                          for cryptographic operations based on the specified keyUsages.
 *
 * @throws {Error} Throws an error if:
 *                 - The crypto module is unavailable in the current environment
 *                 - Invalid key format or algorithm specification
 *                 - Key data is malformed or incompatible with the specified format
 *                 - Requested key usages are incompatible with the algorithm
 *                 - Environment doesn't support the specified algorithm
 *
 * @example
 * // Import RSA public key from SPKI format
 * const publicKeyData = new Uint8Array([...]); // DER-encoded SPKI data
 * const publicKey = await importCryptoKey(
 *   'spki',
 *   publicKeyData,
 *   {
 *     name: 'RSA-OAEP',
 *     hash: 'SHA-256'
 *   },
 *   false,
 *   ['encrypt']
 * );
 *
 * @example
 * // Import AES symmetric key from raw bytes
 * const keyBytes = crypto.getRandomValues(new Uint8Array(32)); // 256-bit key
 * const aesKey = await importCryptoKey(
 *   'raw',
 *   keyBytes,
 *   { name: 'AES-GCM' },
 *   true,
 *   ['encrypt', 'decrypt']
 * );
 *
 * @example
 * // Import key from JSON Web Key format
 * const jwkData = {
 *   kty: 'RSA',
 *   use: 'sig',
 *   n: '...', // base64url-encoded modulus
 *   e: 'AQAB', // base64url-encoded exponent
 *   // ... other JWK properties
 * };
 * const rsaKey = await importCryptoKey(
 *   'jwk',
 *   jwkData,
 *   { name: 'RSA-PSS', hash: 'SHA-256' },
 *   false,
 *   ['verify']
 * );
 */
async function importCryptoKey(format, keyData, algorithm, extractable, keyUsages) {
  // Retrieve the appropriate crypto module for the current environment
  const crypto = getCrypto();
  
  // Delegate key import operation to the Web Crypto API
  // The subtle.importKey method handles the actual cryptographic key parsing and validation
  return await crypto.subtle.importKey(
    format,
    keyData,
    algorithm,
    extractable,
    keyUsages
  );
}

// ------------------------------------------------------------------------------------------------

/**
 * Criptografa dados binários (Buffer/Uint8Array) usando uma chave pública RSA.
 *
 * Esta função gerencia o fluxo de criptografia completo: processa uma chave pública
 * em formato PEM, importa-a para a Web Crypto API e criptografa os dados usando
 * o algoritmo RSA-OAEP, que é o padrão da indústria para preenchimento (padding).
 *
 * @async
 * @function encryptBuffer
 *
 * @param {string} publicKey A chave pública em formato PEM. Deve ser uma string
 * válida, incluindo os cabeçalhos `-----BEGIN PUBLIC KEY-----` e `-----END PUBLIC KEY-----`.
 *
 * @param {Buffer|Uint8Array} messageBuffer Os dados binários a serem criptografados.
 * - Em Node.js, pode ser um `Buffer`.
 * - No navegador, pode ser um `Uint8Array`.
 * - O tamanho máximo dos dados é limitado pelo tamanho da chave e pelo esquema de
 * padding. Por exemplo:
 * - Chave de 2048 bits (RSA-OAEP): ~190 bytes.
 * - Chave de 4096 bits (RSA-OAEP): ~446 bytes.
 *
 * @param {object} [options={}] Opções para personalizar a importação da chave e a criptografia.
 * @property {string} [options.format='spki'] O formato da chave a ser importada.
 * Valores comuns são 'spki' (padrão) ou 'jwk'.
 * @property {RsaHashedImportParams} [options.algorithm={name: 'RSA-OAEP', hash: 'SHA-256'}]
 * O algoritmo a ser usado para a importação da chave.
 * @property {boolean} [options.extractable=true] Se a chave importada pode ser exportada.
 * @property {string[]} [options.keyUsages=['encrypt']] As operações permitidas para a chave.
 * Deve incluir 'encrypt'.
 * @property {string} [options.padding='RSA-OAEP'] O esquema de preenchimento (padding) a ser
 * usado na criptografia.
 *
 * @returns {Promise<string>} Uma Promise que resolve para uma string codificada em base64
 * contendo os dados criptografados. Retorna uma string vazia se `messageBuffer` for vazio.
 *
 * @throws {Error} Lança um erro se a chave for inválida, a mensagem exceder o
 * limite de tamanho para a chave, ou se a operação criptográfica falhar.
 *
 * @example
 * // Exemplo de uso para criptografar uma mensagem
 * const publicKeyPem = `-----BEGIN PUBLIC KEY-----
 * MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
 * -----END PUBLIC KEY-----`;
 *
 * // No Node.js:
 * // const buffer = Buffer.from('Hello, World!');
 *
 * // No navegador:
 * // const buffer = new TextEncoder().encode('Hello, World!');
 *
 * try {
 * const encrypted = await encryptBuffer(publicKeyPem, buffer);
 * console.log('Dados criptografados (base64):', encrypted);
 * } catch (error) {
 * console.error('Falha na criptografia:', error);
 * }
 */
async function encryptBuffer(publicKey, messageBuffer, props = {}) {
  // Handle empty buffer case early for performance
  if (!messageBuffer || messageBuffer.length === 0) return "";

  // Extract crypto module for the current environment
  const crypto = getCrypto();

  // Clean and convert PEM-formatted public key to binary format
  const cleanedPublicKey = publicKey.replace(
    /(-----(BEGIN|END) (RSA )?(PRIVATE|PUBLIC) KEY-----|\s)/g,
    ""
  );
  const binaryPublicKey = base64ToBuffer(cleanedPublicKey);

  // Destructure configuration with defaults
  const {
    format = "spki",
    algorithm = { name: "RSA-OAEP", hash: { name: "SHA-256" } },
    extractable = true,
    keyUsages = ["encrypt"],
    padding = "RSA-OAEP",
  } = props || {};

  // Import the public key into Web Crypto API format
  const importedKey = await importCryptoKey(
    format || "spki",
    binaryPublicKey,
    algorithm || {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    extractable !== undefined ? extractable : true,
    keyUsages || ["encrypt"]
  );

  // Perform the actual encryption operation using the imported key
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: padding || "RSA-OAEP" },
    importedKey,
    messageBuffer
  );

  // Convert encrypted binary data to base64 for safe text transmission
  return base64FromBuffer(encryptedBuffer);
}

// ------------------------------------------------------------------------------------------------

/**
 * @summary Encripta uma mensagem em pedaços (chunks) usando RSA-OAEP.
 *
 * @description
 * Esta função assíncrona primeiro converte o payload para um buffer de bytes.
 * Em seguida, divide esse buffer em pedaços (chunks) e encripta cada um deles
 * em paralelo para máxima performance. O resultado é um array de strings, onde
 * cada uma representa um pedaço encriptado em base64.
 *
 * @param {string} publicKey - A chave pública RSA (formato string PEM) a ser usada.
 * @param {object} payload - A carga a ser encriptada.
 * @param {object} [props={}] - Propriedades adicionais para a encriptação.
 * @param {number} [props.chunkSize=190] - O tamanho máximo de cada pedaço em bytes.
 * O padrão 190 é o limite seguro para chaves RSA de 2048 bits com padding OAEP.
 *
 * @returns {Promise<string[]>} Uma Promise que resolve para um array de pedaços encriptados.
 */
async function messageEncryptToChunks(publicKey, payload, props = {}) {
  if (payload === undefined || payload === null) {
    return []; // Retornar um array vazio é mais consistente com o tipo de retorno
  }
  let { chunkSize } = props || {};
  if (!isFinite(chunkSize) || chunkSize <= 0) {
    chunkSize = 190;
  }

  const jsonPayload = JSON.stringify({ data: payload });
  const bufferPayload = bufferFromString(jsonPayload);
  const chunks = [];

  // 1. Divide o buffer principal em vários buffers menores (chunks).
  for (let i = 0; i < bufferPayload.length; i += chunkSize) {
    chunks.push(bufferPayload.slice(i, i + chunkSize));
  }

  // 2. Mapeia cada chunk de buffer para uma promessa de encriptação.
  const encryptionPromises = chunks.map((chunk) => {
    return encryptBuffer(publicKey, chunk, props);
  });
  
  // 3. Executa todas as encriptações em paralelo para máxima performance.
  return await Promise.all(encryptionPromises);
}

// ------------------------------------------------------------------------------------------------

/**
 * Decriptografa uma mensagem em base64 usando uma chave privada RSA.
 *
 * Esta função gerencia o fluxo de decriptografia completo: processa uma chave privada
 * em formato PEM, decodifica a mensagem criptografada de base64, importa a chave
 * para a Web Crypto API e decriptografa os dados usando o algoritmo RSA-OAEP.
 *
 * @async
 * @function decryptBuffer
 *
 * @param {string} privateKey A chave privada em formato PEM. Deve ser uma string
 * válida, incluindo os cabeçalhos `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`.
 *
 * @param {string} encryptedMessage A mensagem criptografada e codificada em base64
 * que será decriptografada.
 *
 * @param {object} [options={}] Opções para personalizar a importação da chave e a decriptografia.
 * @property {string} [options.format='pkcs8'] O formato da chave privada a ser importada.
 * O padrão 'pkcs8' é o formato mais comum.
 * @property {RsaHashedImportParams} [options.algorithm={name: 'RSA-OAEP', hash: 'SHA-256'}]
 * O algoritmo a ser usado para a importação da chave.
 * @property {boolean} [options.extractable=true] Se a chave importada pode ser exportada.
 * @property {string[]} [options.keyUsages=['decrypt']] As operações permitidas para a chave.
 * Deve incluir 'decrypt'.
 * @property {string} [options.padding='RSA-OAEP'] O esquema de preenchimento (padding)
 * usado na decriptografia. Deve ser o mesmo usado na criptografia.
 *
 * @returns {Promise<Buffer|Uint8Array>} Uma Promise que resolve para os dados
 * decriptografados como um `Buffer` (em Node.js) ou `Uint8Array` (no navegador).
 * Retorna uma string vazia se `encryptedMessage` for vazio.
 *
 * @throws {Error} Lança um erro se a chave for inválida, a mensagem estiver
 * corrompida, ou se a operação criptográfica falhar (ex: padding incorreto).
 *
 * @example
 * // Supondo que `encryptedBase64` foi gerado pela função `encryptBuffer`
 * // e `privateKeyPem` é a chave privada correspondente.
 *
 * try {
 * const decryptedBuffer = await decryptBuffer(privateKeyPem, encryptedBase64);
 *
 * // Para visualizar o resultado como texto:
 * // No Node.js:
 * // console.log('Mensagem decriptografada:', decryptedBuffer.toString('utf8'));
 *
 * // No navegador:
 * // console.log('Mensagem decriptografada:', new TextDecoder().decode(decryptedBuffer));
 * } catch (error) {
 * console.error('Falha na decriptografia:', error);
 * }
 */
async function decryptBuffer(privateKey, encryptedMessage, props = {}) {
  // Early return for empty encrypted messages
  if (!encryptedMessage) {
    // Retorna um Uint8Array vazio no navegador ou Buffer vazio no Node
    return getCrypto().subtle ? new Uint8Array(0) : Buffer.alloc(0);
  }

  // Destructure configuration with defaults
  const {
    format = "pkcs8",
    algorithm = { name: "RSA-OAEP", hash: { name: "SHA-256" } },
    extractable = true,
    keyUsages = ["decrypt"],
    padding = "RSA-OAEP"
  } = props || {};

  // Get crypto implementation
  const crypto = getCrypto();

  // Clean and convert PEM private key to binary
  const cleanedPrivateKey = privateKey.replace(
    /-----(BEGIN|END) (?:RSA )?(?:PRIVATE|PUBLIC) KEY-----|\s/g,
    ""
  );
  const binaryPrivateKey = base64ToBuffer(cleanedPrivateKey);

  // Import the private key
  const importedKey = await importCryptoKey(
    format,
    binaryPrivateKey,
    algorithm,
    extractable,
    keyUsages
  );

  // Convert base64 encrypted message to binary
  const encryptedData = base64ToBuffer(encryptedMessage);

  // Perform decryption
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: padding },
    importedKey,
    encryptedData
  );

  // Return the raw decrypted buffer
  return decryptedBuffer;
}

// ------------------------------------------------------------------------------------------------

/**
 * @summary Decripta uma mensagem a partir de pedaços (chunks) encriptados.
 *
 * @description
 * Esta função assíncrona recebe um array de pedaços encriptados, decripta cada um
 * deles em paralelo para máxima performance, e então concatena os buffers resultantes
 * para reconstruir a mensagem original.
 *
 * @param {string} privateKey - A chave privada RSA (formato string PEM) a ser usada.
 * @param {string[]} messageChunks - Um array de strings, onde cada uma é um pedaço encriptado.
 * @param {object} [props={}] - Propriedades adicionais para a decriptação.
 *
 * @returns {Promise<any>} Uma Promise que resolve para o payload original decriptado.
 */
async function messageDecryptFromChunks(privateKey, messageChunks, props = {}) {
  if (!messageChunks || messageChunks.length === 0) {
    return "";
  }

  const decryptionPromises = messageChunks.map(chunk =>
    decryptBuffer(privateKey, chunk, props)
  );
  const decryptedBuffers = await Promise.all(decryptionPromises);

  
  // Lógica de concatenação de alta performance.
  // Etapa A: Calcula o tamanho total necessário para o buffer final.
  let totalLength = 0;
  for (const buffer of decryptedBuffers) {
    totalLength += buffer.byteLength;
  }

  // Etapa B: Aloca um único buffer grande (Uint8Array) de uma só vez.
  const finalBuffer = new Uint8Array(totalLength);

  // Etapa C: Copia cada buffer decriptado para a sua posição correta no buffer final.
  let offset = 0;
  for (const buffer of decryptedBuffers) {
    finalBuffer.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }

  const jsonString = bufferToString(finalBuffer);
  
  const payload = JSON.parse(jsonString);

  return payload.data;
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para normalizar strings, removendo acentos.
 */

/**
 * @summary Remove acentos e outros caracteres diacríticos de uma string.
 *
 * @description
 * Esta função converte uma string para sua forma normalizada (NFD - Normalization Form
 * Canonical Decomposition), que separa os caracteres base de seus acentos (marcas
 * diacríticas combinadas). Em seguida, uma expressão regular remove essas marcas,
 * resultando em uma string "limpa", sem acentuação.
 *
 * A função processa apenas entradas do tipo `string` ou `number`, retornando
 * outros tipos de dados inalterados.
 *
 * @param {string | number} [text=""] - O texto a ser normalizado.
 *
 * @returns {*} A string normalizada, ou o valor original se a entrada não for
 * uma string ou número.
 *
 * @example
 * const acentuado = 'Pão de Açúcar & Linguiça';
 * const normalizado = normalize(acentuado);
 * console.log(normalizado); // "Pao de Acucar & Linguica"
 *
 * normalize(123.45); // Retorna a string "123.45"
 * normalize({ a: 1 }); // Retorna o objeto { a: 1 } inalterado
 */
function normalize(text = "") {
  // 1. Verifica se a entrada é um tipo que pode ser normalizado (string ou número).
  if (isNumber(text) || typeof text === "string") {
    // 2. Converte para string (caso seja número) e aplica a normalização.
    // "NFD" decompõe um caractere como "ç" em seus componentes: "c" + "¸".
    // A regex /[\u0300-\u036f]/g então remove o componente de acentuação (o intervalo
    // Unicode para "Combining Diacritical Marks").
    return String(text)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  // 3. Se a entrada não for do tipo esperado, retorna-a inalterada.
  return text;
}

/**
 * @fileoverview Fornece uma função para criar um novo objeto contendo apenas um
 * subconjunto de chaves de um objeto de origem.
 */

/**
 * @summary Cria um novo objeto contendo apenas as chaves especificadas de um objeto de origem.
 * @description Itera sobre um array de chaves (`keysToPick`) e constrói um novo objeto
 * com as chaves e valores correspondentes do objeto de origem (`sourceObject`).
 * Chaves que existem em `keysToPick` mas não no `sourceObject` são ignoradas.
 * A função não modifica o objeto original.
 *
 * @param {object} sourceObject - O objeto do qual as propriedades serão selecionadas.
 * @param {string[]} keysToPick - Um array de nomes de chaves (strings) a serem incluídas no novo objeto.
 * @returns {object} Um novo objeto contendo apenas as propriedades selecionadas.
 *
 * @example
 * const user = {
 * id: 123,
 * name: 'John Doe',
 * email: 'john.doe@example.com',
 * isAdmin: true,
 * lastLogin: new Date()
 * };
 *
 * const keys = ['id', 'name', 'email'];
 * const publicUserData = pickKeys(user, keys);
 *
 * // Retorna: { id: 123, name: 'John Doe', email: 'john.doe@example.com' }
 * console.log(publicUserData);
 *
 * @example
 * // Chaves não existentes são simplesmente ignoradas
 * const partialData = pickKeys(user, ['id', 'nonExistentKey']);
 * // Retorna: { id: 123 }
 * console.log(partialData);
 */
function pickKeys(sourceObject, keysToPick) {
  // Validação de entradas para garantir robustez. Retorna um objeto vazio para entradas inválidas.
  if (
    sourceObject === null ||
    typeof sourceObject !== "object" ||
    Array.isArray(sourceObject)
  ) {
    return {};
  }
  if (!Array.isArray(keysToPick)) {
    return {};
  }

  // Usa reduce para construir o novo objeto de forma eficiente e funcional.
  return keysToPick.reduce((newObj, key) => {
    // Verifica se a chave existe como uma propriedade própria do objeto de origem.
    // Usar Object.prototype.hasOwnProperty.call é a forma mais segura de fazer essa checagem.
    if (Object.prototype.hasOwnProperty.call(sourceObject, key)) {
      newObj[key] = sourceObject[key];
    }
    return newObj;
  }, {});
}
// ------------------------------------------------------------------------------------------------

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

/**
 * @file Utilitário para extrair apenas dígitos de um valor.
 */

/**
 * @summary Extrai apenas os dígitos de uma string ou de outro valor.
 *
 * @description
 * Esta função recebe um valor de qualquer tipo, o converte para uma string e remove
 * todos os caracteres que não são dígitos (0-9). É útil para limpar entradas de
 * usuário, como números de telefone, CEPs ou CPFs que podem conter máscaras
 * (pontos, traços, parênteses).
 *
 * @param {*} [text=""] - O valor do qual os dígitos serão extraídos.
 *
 * @returns {string} Uma string contendo apenas os dígitos do valor de entrada.
 *
 * @example
 * const phoneNumber = '(11) 98765-4321';
 * const digits = regexDigitsOnly(phoneNumber);
 * console.log(digits); // "11987654321"
 *
 * const price = 'R$ 19,90';
 * const priceDigits = regexDigitsOnly(price);
 * console.log(priceDigits); // "1990"
 *
 * regexDigitsOnly(123.45); // Retorna "12345"
 */
function regexDigitsOnly(text = "") {
  // 1. Converte a entrada para uma string de forma segura.
  const stringValue = toString(text);

  // 2. Remove todos os caracteres que não são dígitos (0-9).
  // A regex `/[^0-9]/g` encontra qualquer caractere que não esteja no intervalo de 0 a 9
  // e o substitui por uma string vazia.
  return stringValue.replace(/[^0-9]/g, "");
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para substituir caracteres em uma string com base em um conjunto permitido.
 */

/**
 * @summary Substitui caracteres em uma string que não pertencem a um conjunto de caracteres permitido.
 *
 * @description
 * Esta função cria dinamicamente uma expressão regular a partir de uma string que define um
 * conjunto de caracteres permitidos. Ela então remove ou substitui todos os caracteres da
 * string de entrada que não fazem parte desse conjunto. É uma ferramenta flexível
 * para limpar e sanitizar strings.
 *
 * @param {*} [text=""] - O valor a ser processado, que será convertido para string.
 * @param {string} [regex="A-Za-zÀ-ú0-9 "] - Uma string que define o conjunto de caracteres
 * a serem **mantidos**. Pode incluir intervalos, como `A-Z` ou `0-9`.
 * @param {string} [replacement=""] - A string que substituirá cada caractere não permitido.
 * @param {boolean} [trim=true] - Se `true`, remove espaços em branco do início e do fim do resultado.
 *
 * @returns {string} A string resultante após a substituição e o trim opcional.
 *
 * @example
 * // Manter apenas letras e números, substituindo o resto por '*'
 * const text = "Hello! @123 World_456";
 * const allowed = "A-Za-z0-9";
 * const result = regexReplaceTrim(text, allowed, "*");
 * console.log(result); // "Hello***123*World*456"
 *
 * // Manter apenas letras maiúsculas e remover o resto
 * const textWithSpaces = "   A B C   ";
 * const resultTrimmed = regexReplaceTrim(textWithSpaces, "A-Z", "");
 * console.log(resultTrimmed); // "ABC"
 */
function regexReplaceTrim(
  text = "",
  regex = "A-Za-zÀ-ú0-9 ",
  replacement = "",
  trim = true
) {
  // 1. Converte as entradas para string para garantir a operação.
  const stringValue = toString(text);
  const allowedChars = toString(regex);
  const replacementValue = toString(replacement);

  // 2. Constrói a expressão regular que corresponde a qualquer caractere NÃO presente no conjunto.
  // A string `allowedChars` é inserida diretamente para permitir intervalos como 'A-Z'.
  const filterRegex = new RegExp(`[^${allowedChars}]`, "g");

  // 3. Realiza a substituição uma única vez para evitar duplicação de código.
  let result = stringValue.replace(filterRegex, replacementValue);

  // 4. Aplica o trim opcionalmente ao resultado.
  if (trim) {
    result = result.trim();
  }

  return result;
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para extrair apenas letras de um valor.
 */

/**
 * @summary Extrai apenas caracteres alfabéticos (letras) de uma string ou de outro valor.
 *
 * @description
 * Esta função recebe um valor de qualquer tipo, o converte para uma string e remove
 * todos os caracteres que não são letras, como números, símbolos, espaços e
 * pontuação. Ela preserva tanto letras do alfabeto padrão (a-z, A-Z) quanto
 * a maioria das letras acentuadas comuns (à, ç, õ, etc.).
 *
 * @param {*} [text=""] - O valor do qual as letras serão extraídas.
 *
 * @returns {string} Uma string contendo apenas as letras do valor de entrada.
 *
 * @example
 * const fullName = 'José "Zé" da Silva - 1985';
 * const letters = regexLettersOnly(fullName);
 * console.log(letters); // "JoséZédaSilva"
 *
 * const product = 'Camiseta (Polo) - Azul';
 * const productName = regexLettersOnly(product);
 * console.log(productName); // "CamisetaPoloAzul"
 */
function regexLettersOnly(text = "") {
  // 1. Converte a entrada para uma string de forma segura.
  const stringValue = toString(text);

  // 2. Remove todos os caracteres que não são letras.
  // A regex `/[^A-Za-zÀ-ú]/g` encontra qualquer caractere que não esteja nos
  // intervalos de 'A' a 'Z', 'a' a 'z', ou no intervalo de caracteres acentuados comuns.
  return stringValue.replace(/[^A-Za-zÀ-ú]/g, "");
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para remover substrings duplicadas de uma string.
 */

/**
 * @summary Remove substrings duplicadas de um texto, com opção de ignorar maiúsculas/minúsculas.
 *
 * @description
 * Esta função divide uma string em um array de substrings, remove as duplicatas
 * e une as substrings de volta em uma única string.
 *
 * **Comportamento Importante:**
 * - No modo padrão (sensível a maiúsculas/minúsculas), a **primeira** ocorrência de uma substring é mantida.
 * - No modo insensível a maiúsculas/minúsculas, a **última** ocorrência de uma substring é mantida, preservando sua capitalização original.
 *
 * @param {*} text - O valor a ser processado, que será convertido para string.
 * @param {string} [splitString=" "] - O caractere ou string usado para dividir o texto.
 * @param {boolean} [caseInsensitive=false] - Se `true`, a comparação de duplicatas
 * ignorará a diferença entre maiúsculas e minúsculas.
 *
 * @returns {string} Uma nova string com as substrings duplicadas removidas. Retorna uma
 * string vazia se a entrada for um objeto.
 *
 * @example
 * const phrase = 'apple Orange apple ORANGE';
 *
 * // Sensível a maiúsculas/minúsculas (mantém a primeira ocorrência)
 * removeDuplicatedStrings(phrase); // "apple Orange ORANGE"
 *
 * // Insensível a maiúsculas/minúsculas (mantém a última ocorrência)
 * removeDuplicatedStrings(phrase, ' ', true); // "apple ORANGE"
 */
function removeDuplicatedStrings(
  text,
  splitString = " ",
  caseInsensitive = false
) {
  // 1. Validação da entrada.
  if (isObject(text)) {
    return "";
  }

  // 2. Prepara o array de substrings.
  const separator = toString(splitString);
  const array = toString(text)
    .trim()
    .split(separator)
    .filter(v => v);

  // 3. Lógica para remover duplicatas.
  if (!caseInsensitive) {
    // Mantém a PRIMEIRA ocorrência de cada item.
    return [...new Set(array)].join(separator);
  } else {
    // Lógica para manter a ÚLTIMA ocorrência, de forma performática.
    const seenIndexes = {};
    // 1. Mapeia a versão minúscula de cada item para o seu último índice no array.
    array.forEach((item, index) => {
      seenIndexes[item.toLowerCase()] = index;
    });

    // 2. Extrai apenas os índices que devem ser mantidos (os das últimas ocorrências).
    const indexesToKeep = new Set(Object.values(seenIndexes));

    // 3. Filtra o array original, mantendo apenas os itens nos índices desejados.
    // Isso preserva a ordem e a capitalização corretas.
    return array
      .filter((_item, index) => indexesToKeep.has(index))
      .join(separator);
  }
}

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

/**
 * @file Utilitário cross-platform e performático para compressão de strings.
 */

/**
 * @typedef {object} CompressionOptions - Opções para a função de compressão.
 * @property {'base64' | 'buffer'} [outputType='base64'] - O formato da saída. 'base64' para uma string ou 'buffer' para um Uint8Array.
 * @property {number} [level=6] - O nível de compressão (0-9). Níveis mais altos são mais lentos mas podem gerar saídas menores.
 * @property {number} [mem=8] - O nível de uso de memória (1-12). Níveis mais altos são mais rápidos e podem comprimir melhor, mas usam mais memória.
 */

/**
 * @summary Comprime uma string usando o algoritmo DEFLATE, retornando Base64 ou um buffer.
 *
 * @description
 * Esta função síncrona recebe uma string, a converte para bytes em UTF-8 e a comprime
 * de forma eficiente usando a biblioteca `fflate`. O resultado é retornado no formato
 * especificado pelo `outputType`: uma string Base64 (ideal para transmissão em texto)
 * ou um `Uint8Array` (para manipulação binária).
 *
 * @param {string} text - A string a ser comprimida.
 * @param {CompressionOptions} [options={}] - Opções para customizar a compressão e o formato de saída.
 *
 * @returns {string | Uint8Array} A string comprimida em Base64 ou o `Uint8Array` dos dados comprimidos.
 * Retorna um valor vazio apropriado (string ou Uint8Array) para entradas inválidas.
 *
 * @example
 * const textoOriginal = 'Um texto longo para ser comprimido. Repetir, repetir, repetir.';
 *
 * // Comprimir para Base64 (padrão)
 * const comprimidoB64 = stringCompress(textoOriginal);
 *
 * // Comprimir para um buffer binário com nível de compressão máximo
 * const comprimidoBuffer = stringCompress(textoOriginal, { outputType: 'buffer', level: 9 });
 */
function stringCompress(text, options = {}) {
  // 1. Define as opções padrão e as mescla com as fornecidas pelo usuário
  // para garantir um comportamento robusto e previsível.
  const finalOptions = {
    outputType: 'base64',
    level: 6,
    mem: 8,
    ...options
  };

  // 2. Valida a entrada.
  if (typeof text !== 'string' || text.length === 0) {
    // Retorna um valor vazio do tipo de saída esperado para manter a consistência.
    return finalOptions.outputType === 'buffer' ? new Uint8Array() : "";
  }

  // 3. Converte a string de entrada para um buffer de bytes UTF-8.
  // `strToU8` é um helper otimizado da biblioteca `fflate`.
  const inputBuffer = strToU8(text);

  // 4. Comprime o buffer usando as opções especificadas.
  const compressedBuffer = compressSync(inputBuffer, {
    level: finalOptions.level,
    mem: finalOptions.mem,
  });

  // 5. Retorna o resultado no formato solicitado.
  if (finalOptions.outputType === 'buffer') {
    return compressedBuffer;
  }

  // Por padrão, retorna em Base64. A conversão de binário para Base64
  // é feita de forma diferente e otimizada para cada ambiente.
  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
    // **Ambiente Node.js:**
    // Converte o Uint8Array para um Buffer e então para Base64. É o método mais rápido.
    return Buffer.from(compressedBuffer).toString('base64');
  } else {
    // **Ambiente do Navegador:**
    // Converte o Uint8Array para uma "binary string" e usa a função nativa `btoa`.
    let binary = '';
    const len = compressedBuffer.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(compressedBuffer[i]);
    }
    return btoa(binary);
  }
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário cross-platform e performático para descompressão de strings.
 */

/**
 * @typedef {object} DecompressionOptions - Opções para a função de descompressão.
 * @property {'base64' | 'buffer'} [inputType='base64'] - O formato da entrada de dados comprimidos.
 */

/**
 * @summary Descomprime dados (Base64 ou buffer) de volta para a string original.
 *
 * @description
 * Esta função síncrona é a contraparte da `stringCompress`. Ela recebe dados comprimidos,
 * seja como uma string Base64 ou um `Uint8Array`, e os descomprime para a string de
 * texto original em formato UTF-8, utilizando a biblioteca `fflate`.
 *
 * @param {string | Uint8Array} compressedData - Os dados comprimidos a serem descomprimidos.
 * @param {DecompressionOptions} [options={}] - Opções para customizar o tipo de entrada.
 *
 * @returns {string} A string original descomprimida. Retorna uma string vazia se a
 * entrada for inválida ou se a descompressão falhar (ex: dados corrompidos).
 *
 * @example
 * const textoOriginal = 'O texto original que será comprimido e depois descomprimido.';
 *
 * // 1. Comprime para Base64
 * const comprimidoB64 = stringCompress(textoOriginal);
 *
 * // 2. Descomprime de volta para o original
 * const descomprimido = stringDecompress(comprimidoB64);
 *
 * console.log(descomprimido === textoOriginal); // true
 */
function stringDecompress(compressedData, options = {}) {
  // 1. Define as opções padrão e as mescla com as fornecidas pelo usuário.
  const finalOptions = {
    inputType: 'base64',
    ...options
  };

  // 2. Valida a entrada principal.
  if (!compressedData) {
    return "";
  }

  try {
    let inputBuffer;

    // 3. Normaliza a entrada para um formato de buffer binário (`Uint8Array`).
    if (finalOptions.inputType === 'base64') {
      // Garante que a entrada é uma string antes de tentar decodificar.
      if (typeof compressedData !== 'string') {
        return "";
      }
      
      // A decodificação de Base64 para binário é feita de forma otimizada para cada ambiente.
      if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
        // **Ambiente Node.js:**
        // `Buffer.from` lida com Base64 nativamente e é muito rápido.
        inputBuffer = Buffer.from(compressedData, 'base64');
      } else {
        // **Ambiente do Navegador:**
        // Usa `atob` para decodificar para uma "binary string" e então converte para Uint8Array.
        const binaryString = atob(compressedData);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        inputBuffer = bytes;
      }
    } else {
      // Se o tipo for 'buffer', assume que a entrada já está em um formato binário compatível.
      inputBuffer = compressedData;
    }

    // Valida se a conversão ou a entrada resultou em um buffer com conteúdo.
    if (!inputBuffer || inputBuffer.byteLength === 0) {
      return "";
    }

    // 4. Descomprime o buffer. Esta operação pode falhar se os dados estiverem corrompidos.
    const decompressedBuffer = decompressSync(inputBuffer);

    // 5. Converte o buffer descomprimido de volta para uma string UTF-8.
    return strFromU8(decompressedBuffer);
  } catch (error) {
    // Retorna uma string vazia se a descompressão falhar (ex: dados corrompidos ou Base64 inválido).
    return "";
  }
}

// ------------------------------------------------------------------------------------------------

/**
 * @summary Converte uma string para um objeto Date, com base em um padrão de formato.
 *
 * @description
 * Esta função utiliza a biblioteca `date-fns` para analisar uma string de data com um
 * formato específico e retornar um objeto `Date`.
 *
 * Um passo importante desta função é que ela trata os valores da string como se
 * estivessem em UTC. Por exemplo, a string "2025-08-21 10:30:00" (sem fuso) será convertida para
 * um objeto `Date` que, em UTC, representa `2025-08-21T10:30:00.000Z`.
 *
 * @param {string} stringDate - A string da data a ser analisada.
 * @param {string} [stringFormat=DATE_ISO_FORMAT] - O padrão de formatação da `stringDate`,
 * compatível com `date-fns`.
 * @param {Date} [defaultDate=new Date()] - O valor a ser retornado se a análise falhar.
 * Se `defaultDate` for `null` ou `undefined`, a função retorna `false`.
 *
 * @returns {Date | false} O objeto `Date` resultante, o `defaultDate` em caso de falha,
 * ou `false` se a análise falhar e não houver `defaultDate`.
 */
function stringToDate(
  stringDate,
  stringFormat = DATE_ISO_FORMAT,
  defaultDate = new Date()
) {
  let dateToProcess;

  // 1. Tenta analisar a string ou define o fallback inicial.
  if (typeof stringDate === 'string') {
    const parsedDate = parse(stringDate, stringFormat, new Date());

    // Verifica se a análise foi bem-sucedida.
    if (isInstanceOf(parsedDate, Date) && !isNaN(parsedDate.getTime())) {
      dateToProcess = parsedDate;
    } else {
      // Se a análise falhar, usa a data padrão como fallback.
      dateToProcess = defaultDate;
    }
  } else {
    // Se a entrada não for uma string, usa a data padrão.
    dateToProcess = defaultDate;
  }

  // 2. Valida a data a ser processada (seja ela a analisada ou a padrão).
  if (dateToProcess == null) {
    // Se a data padrão era nula/indefinida, retorna `false`.
    return false;
  }
  
  if (!isInstanceOf(dateToProcess, Date) || isNaN(dateToProcess.getTime())) {
      // Se a data padrão fornecida for inválida, retorna `false`.
      return false;
  }

  // 3. Aplica o ajuste de fuso horário a QUALQUER data válida que saia da função.
  // Isso garante um comportamento consistente tanto para datas analisadas quanto para as padrão.
  const timezoneOffsetMillis = dateToProcess.getTimezoneOffset() * 60 * 1000;
  return new Date(dateToProcess.getTime() - timezoneOffsetMillis);
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para re-formatar strings de data.
 */

/**
 * @summary Re-formata uma string de data de um formato de entrada para um de saída.
 *
 * @description
 * Esta função é um utilitário de conveniência que combina a análise e a formatação
 * de datas em uma única etapa. Ela usa `stringToDate` para converter a string de entrada em um
 * objeto `Date` e, em seguida, usa `dateToFormat` para converter esse objeto de volta
 * para uma string no formato de saída desejado.
 *
 * @param {string} stringDate - A string da data a ser re-formatada.
 * @param {string} [fromFormat=DATE_ISO_FORMAT] - O padrão de formatação da string de entrada.
 * @param {string} [toFormat=DATE_BR_HOUR_FORMAT_D] - O padrão de formatação desejado para a saída.
 *
 * @returns {string | false} A nova string de data formatada, ou `false` se a
 * análise da data de entrada falhar.
 */
function stringToDateToFormat(
  stringDate,
  fromFormat = DATE_ISO_FORMAT,
  toFormat = DATE_BR_HOUR_FORMAT_D
) {
  try {
    // 1. Converte a string de entrada para um objeto Date.
    // `stringToDate` retorna um Date cujo tempo UTC corresponde aos números da string.
    const dateObject = stringToDate(stringDate, fromFormat, false);

    if (dateObject) {
      // 2. Reverte o ajuste de fuso horário antes de formatar.
      // `stringToDate` removeu o offset local para tratar a hora como UTC.
      // Para que `dateToFormat` (que formata em hora local) exiba os números corretos,
      // é necessário adicionar o offset de volta, criando uma nova data ajustada.
      const timezoneOffsetMillis = dateObject.getTimezoneOffset() * 60 * 1000;
      const localDate = new Date(dateObject.getTime() + timezoneOffsetMillis);

      // 3. Formata o objeto Date (agora ajustado para a hora local correta) para a string de saída.
      return dateToFormat(localDate, toFormat);
    }
  } catch (_) {}
  // 4. Se a conversão inicial falhou, retorna `false`.
  return false;
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário para aplicar máscaras de formatação a strings.
 */

/**
 * @summary Aplica uma máscara de formatação a uma string ou valor.
 *
 * @description
 * Esta função formata uma string de entrada de acordo com um padrão (máscara).
 * Os caracteres `#` no padrão são substituídos sequencialmente pelos caracteres
 * da string de entrada. A função pode opcionalmente limpar a entrada para conter
 * apenas dígitos, e também lida com o preenchimento e truncamento da entrada
 * para que ela se ajuste perfeitamente à máscara.
 *
 * @param {*} [text] - O valor a ser formatado. Será convertido para string.
 * @param {string} [pattern=STRING_FORMAT_CNPJ] - A máscara de formatação, onde `#` é um placeholder.
 * @param {object} [options={}] - Opções para customizar o comportamento.
 * @param {boolean} [options.digitsOnly=false] - Se `true`, a string de entrada será primeiro limpa para conter apenas dígitos.
 * @param {string} [options.paddingChar='0'] - O caractere a ser usado para preencher a entrada à esquerda se ela for menor que o necessário.
 *
 * @returns {string} A string formatada com a máscara.
 *
 * @example
 * // Formatar um CNPJ (com limpeza de dígitos)
 * const cnpj = '12.345.678/0001-90';
 * stringToFormat(cnpj, '##.###.###/####-##', { digitsOnly: true });
 * // Retorna: "12.345.678/0001-90"
 *
 * // Formatar um valor com preenchimento à esquerda
 * stringToFormat('123', 'ID-######', { paddingChar: '0' });
 * // Retorna: "ID-000123"
 */
function stringToFormat(
  text,
  pattern = STRING_FORMAT_CNPJ,
  options = {}
) {
  // 1. Define e mescla as opções para um manuseio robusto de parâmetros.
  const finalOptions = {
    digitsOnly: false,
    paddingChar: "0",
    ...options
  };

  let processedText = toString(text);

  // 2. Aplica a limpeza de dígitos opcionalmente.
  if (finalOptions.digitsOnly) {
    processedText = regexDigitsOnly(processedText);
  }

  // 3. Calcula o tamanho necessário com base nos placeholders '#' no padrão.
  const requiredSize = (pattern.match(/#/g) || []).length;
  if (requiredSize === 0) {
      return pattern; // Se não houver placeholders, retorna o padrão literal.
  }

  // 4. Garante que o texto tenha o tamanho exato: trunca se for longo, preenche se for curto.
  processedText = processedText.slice(0, requiredSize).padStart(requiredSize, finalOptions.paddingChar);

  // 5. Aplica a máscara de forma funcional.
  // A cada ocorrência de '#', a função de callback fornece o próximo
  // caractere do texto processado para a substituição.
  let charIndex = 0;
  return pattern.replace(/#/g, () => processedText[charIndex++]);
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário cross-platform para compressão de strings com Zlib.
 */

/**
 * @typedef {object} ZlibOptions - Opções para a função de compressão Zlib.
 * @property {'base64' | 'buffer'} [outputType='base64'] - O formato da saída. 'base64' para uma string ou 'buffer' para um Uint8Array.
 * @property {number} [level=6] - O nível de compressão (0-9). Níveis mais altos são mais lentos mas podem gerar saídas menores.
 * @property {number} [mem=8] - O nível de uso de memória (1-12). Níveis mais altos são mais rápidos e podem comprimir melhor, mas usam mais memória.
 */

/**
 * @summary Comprime uma string usando o algoritmo Zlib.
 *
 * @description
 * Esta função síncrona recebe uma string, a converte para bytes em UTF-8 e a comprime
 * de forma eficiente usando o formato Zlib da biblioteca `fflate`. O resultado é retornado no formato
 * especificado pelo `outputType`: uma string Base64 ou um `Uint8Array`.
 *
 * @param {string} text - A string a ser comprimida.
 * @param {ZlibOptions} [options={}] - Opções para customizar a compressão e o formato de saída.
 *
 * @returns {string | Uint8Array} A string comprimida em Base64 ou o `Uint8Array` dos dados comprimidos.
 * Retorna um valor vazio apropriado (string ou Uint8Array) para entradas inválidas.
 *
 * @example
 * const textoOriginal = 'Este texto será comprimido com o algoritmo Zlib.';
 *
 * // Comprimir para Base64 (padrão)
 * const comprimidoB64 = stringZLibCompress(textoOriginal);
 *
 * // Comprimir para um buffer binário com nível de compressão máximo
 * const comprimidoBuffer = stringZLibCompress(textoOriginal, { outputType: 'buffer', level: 9 });
 */
function stringZLibCompress(text, options = {}) {
  // 1. Define as opções padrão e as mescla com as fornecidas pelo usuário.
  const finalOptions = {
    outputType: 'base64',
    level: 6,
    mem: 8,
    ...options
  };

  // 2. Valida a entrada.
  if (typeof text !== 'string' || text.length === 0) {
    // Retorna um valor vazio do tipo de saída esperado para manter a consistência.
    return finalOptions.outputType === 'buffer' ? new Uint8Array() : "";
  }

  // 3. Converte a string de entrada para um buffer de bytes UTF-8.
  const inputBuffer = strToU8(text);

  // 4. Comprime o buffer usando as opções especificadas.
  const compressedBuffer = zlibSync(inputBuffer, {
    level: finalOptions.level,
    mem: finalOptions.mem,
  });

  // 5. Retorna o resultado no formato solicitado.
  if (finalOptions.outputType === 'buffer') {
    return compressedBuffer;
  }

  // Por padrão, retorna em Base64, com a conversão otimizada para cada ambiente.
  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
    // **Ambiente Node.js:**
    // Converte o Uint8Array para um Buffer e então para Base64. É o método mais rápido.
    return Buffer.from(compressedBuffer).toString('base64');
  } else {
    // **Ambiente do Navegador:**
    // Converte o Uint8Array para uma "binary string" e usa a função nativa `btoa`.
    let binary = '';
    const len = compressedBuffer.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(compressedBuffer[i]);
    }
    return btoa(binary);
  }
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Utilitário cross-platform para descompressão de strings com Zlib.
 */

/**
 * @typedef {object} ZlibDecompressionOptions - Opções para a função de descompressão Zlib.
 * @property {'base64' | 'buffer'} [inputType='base64'] - O formato da entrada de dados comprimidos.
 */

/**
 * @summary Descomprime dados (Base64 ou buffer) usando Zlib de volta para a string original.
 *
 * @description
 * Esta função síncrona é a contraparte da `stringZLibCompress`. Ela recebe dados comprimidos
 * no formato Zlib, seja como uma string Base64 ou um `Uint8Array`, e os descomprime
 * para a string de texto original em formato UTF-8.
 *
 * @param {string | Uint8Array} compressedData - Os dados comprimidos a serem descomprimidos.
 * @param {ZlibDecompressionOptions} [options={}] - Opções para customizar o tipo de entrada.
 *
 * @returns {string} A string original descomprimida. Retorna uma string vazia se a
 * entrada for inválida ou se a descompressão falhar (ex: dados corrompidos).
 *
 * @example
 * const textoOriginal = 'Este texto será comprimido e depois descomprimido com Zlib.';
 *
 * // 1. Comprime para Base64
 * const comprimidoB64 = stringZLibCompress(textoOriginal);
 *
 * // 2. Descomprime de volta para o original
 * const descomprimido = stringZLibDecompress(comprimidoB64);
 *
 * console.log(descomprimido === textoOriginal); // true
 */
function stringZLibDecompress(compressedData, options = {}) {
  // 1. Define as opções padrão e as mescla com as fornecidas pelo usuário.
  const finalOptions = {
    inputType: 'base64',
    ...options
  };

  // 2. Valida a entrada principal.
  if (!compressedData) {
    return "";
  }

  try {
    let inputBuffer;

    // 3. Normaliza a entrada para um formato de buffer binário (`Uint8Array`).
    if (finalOptions.inputType === 'base64') {
      if (typeof compressedData !== 'string') {
        return "";
      }
      
      // A decodificação de Base64 para binário é otimizada para cada ambiente.
      if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
        // **Ambiente Node.js:**
        inputBuffer = Buffer.from(compressedData, 'base64');
      } else {
        // **Ambiente do Navegador:**
        const binaryString = atob(compressedData);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        inputBuffer = bytes;
      }
    } else {
      // Se o tipo for 'buffer', assume que a entrada já está em um formato binário.
      inputBuffer = compressedData;
    }

    if (!inputBuffer || inputBuffer.byteLength === 0) {
      return "";
    }

    // 4. Descomprime o buffer. Pode falhar se os dados estiverem corrompidos.
    const decompressedBuffer = unzlibSync(inputBuffer);

    // 5. Converte o buffer descomprimido de volta para uma string UTF-8.
    return strFromU8(decompressedBuffer);
  } catch (error) {
    // Retorna uma string vazia se a descompressão falhar.
    return "";
  }
}

/**
 * @file Utilitário para criar uma função "throttled" (limitada por frequência).
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

/**
 * @description Gera uma string de timestamp altamente customizável e formatada com base em um padrão fornecido.
 * A função é otimizada para calcular apenas os componentes de data/hora necessários para o formato solicitado.
 *
 * @param {string} [format='D-MT-Y_H:MN:S:MS'] A string de formato que define a estrutura da saída.
 * Os seguintes tokens serão substituídos pelos seus respectivos valores:
 * - `Y`: Ano com 4 dígitos (ex: 2025)
 * - `MT`: Mês com 2 dígitos (01-12)
 * - `D`: Dia com 2 dígitos (01-31)
 * - `H`: Hora com 2 dígitos, formato 24h (00-23)
 * - `MN`: Minuto com 2 dígitos (00-59)
 * - `S`: Segundo com 2 dígitos (00-59)
 * - `MS`: Milissegundo com 3 dígitos (000-999)
 *
 * Qualquer outro caractere na string de formato (ex: '-', ':', '_', '/') será mantido como um separador literal.
 *
 * @returns {string} Uma string representando o timestamp formatado de acordo com o padrão.
 *
 * @example
 * // Chamada sem parâmetros, usa o formato padrão.
 * // Retorna algo como: "22-08-2025_19:37:33:456"
 * getFormattedTimestamp();
 *
 * @example
 * // Formato de hora customizado com underscores, como solicitado.
 * // Retorna algo como: "19_37_33_456"
 * getFormattedTimestamp('H_MN_S_MS');
 *
 * @example
 * // Formato de hora simples, como solicitado.
 * // Retorna algo como: "19:37:33"
 * getFormattedTimestamp('H:MN:S');
 *
 * @example
 * // Formato de data para logs (padrão ISO 8601).
 * // Retorna algo como: "2025-08-22"
 * getFormattedTimestamp('Y-MT-D');
 */
function timestamp(format = 'D-MT-Y_H:MN:S:MS') {
  const now = new Date();

  // Mapeamento dos tokens para suas funções de obtenção e formatação.
  // A avaliação é "lazy" (preguiçosa): a função só é executada quando o token correspondente
  // é encontrado na string de formato, melhorando a performance.
  const tokens = {
    // Ano com 4 dígitos
    Y: () => now.getFullYear(),
    // Mês com 2 dígitos (getMonth() é 0-indexado)
    MT: () => String(now.getMonth() + 1).padStart(2, '0'),
    // Dia com 2 dígitos
    D: () => String(now.getDate()).padStart(2, '0'),
    // Hora com 2 dígitos (formato 24h)
    H: () => String(now.getHours()).padStart(2, '0'),
    // Minuto com 2 dígitos
    MN: () => String(now.getMinutes()).padStart(2, '0'),
    // Segundo com 2 dígitos
    S: () => String(now.getSeconds()).padStart(2, '0'),
    // Milissegundo com 3 dígitos
    MS: () => String(now.getMilliseconds()).padStart(3, '0'),
  };

  // Usa uma expressão regular para encontrar e substituir todos os tokens de uma só vez.
  // A flag 'g' (global) garante que todas as ocorrências de tokens sejam substituídas,
  // não apenas a primeira.
  // Para cada token encontrado, a função correspondente no objeto 'tokens' é chamada.
  return format.replace(/Y|MT|D|H|MN|S|MS/g, (token) => tokens[token]());
}

/**
 * @file Utilitário cross-platform para converter strings UTF-8 para Uint8Array.
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

/**
 * @file Utilitário para converter um buffer (ou sua representação em string) para uma string de texto.
 */

/**
 * @summary Converte um `Uint8Array` ou uma string de bytes para uma string de texto (UTF-8).
 *
 * @description
 * Esta função tem um comportamento duplo:
 * 1. **Modo Padrão (sem `splitChar`):** Recebe um objeto buffer-like (`Uint8Array`, `Buffer`, `ArrayBuffer`)
 * e o decodifica para uma string UTF-8.
 * 2. **Modo de Análise (com `splitChar`):** Recebe uma **string** de números (representando bytes),
 * separados pelo `splitChar`. Ela irá analisar essa string, montar um `Uint8Array` e então decodificá-lo.
 *
 * @param {Uint8Array | ArrayBuffer | Buffer | string} uint8Array - O buffer a ser convertido,
 * ou a string de bytes a ser analisada.
 * @param {string} [splitChar] - Opcional. Ativa o modo de análise, usando este caractere como separador.
 *
 * @returns {string} A string decodificada.
 *
 * @example
 * // Modo Padrão (com um buffer real)
 * const bytes = new Uint8Array([72, 101, 108, 108, 111]); // Bytes para "Hello"
 * uint8ArrayToString(bytes); // Retorna "Hello"
 *
 * // Modo de Análise (com uma string de bytes)
 * const byteString = "72,101,108,108,111";
 * uint8ArrayToString(byteString, ','); // Retorna "Hello"
 */
function uint8ArrayToString(uint8Array, splitChar) {
  // 1. Validação de entrada básica.
  if (uint8Array == null) {
    return "";
  }

  let bufferSource = uint8Array;

  // 2. Verifica se está no "Modo de Análise".
  if (splitChar !== undefined && typeof uint8Array === 'string') {
    // Converte a string de números (ex: "72, 101, 108") em um array de números.
    const bytes = uint8Array.split(splitChar).map(s => parseInt(s.trim(), 10));
    // Cria o buffer a partir dos números analisados.
    bufferSource = new Uint8Array(bytes);
  }

  // 3. Decodifica o buffer para uma string UTF-8 (lógica cross-platform).
  // `bufferSource` agora é garantidamente um objeto buffer-like.
  try {
    // Ambiente Node.js:
    if (typeof window === 'undefined') {
      const nodeBuffer = Buffer.isBuffer(bufferSource) ? bufferSource : Buffer.from(bufferSource);
      return nodeBuffer.toString('utf-8');
    }

    // Ambiente do Navegador:
    return new TextDecoder().decode(bufferSource);
  } catch (error) {
    // Retorna uma string vazia se o buffer de entrada for inválido para as APIs.
    return "";
  }
}

// Default export para compatibilidade
var index$5 = {
  assign,
  base64From,
  base64FromBase64URLSafe,
  base64FromBuffer,
  base64To,
  base64ToBuffer,
  base64URLEncode,
  bufferCompare,
  bufferConcatenate,
  bufferFromString,
  bufferToString,
  calculateSecondsInTime,
  cleanObject,
  currencyBRToFloat,
  dateToFormat,
  dateFirstHourOfDay,
  dateLastHourOfDay,
  debouncer,
  deleteKeys,
  generateSimpleId,
  generateRandomString,
  getExecutionTime,
  JSONFrom,
  JSONTo,
  messageEncryptToChunks,
  messageDecryptFromChunks,
  normalize,
  pickKeys,
  pushLogMessage,
  regexDigitsOnly,
  regexReplaceTrim,
  regexLettersOnly,
  removeDuplicatedStrings,
  sleep,
  split,
  stringCompress,
  stringDecompress,
  stringToDate,
  stringToDateToFormat,
  stringToFormat,
  stringZLibCompress,
  stringZLibDecompress,
  throttle,
  timestamp,
  toString,
  uint8ArrayFromString,
  uint8ArrayToString,
};

declare const utilsNamespace_JSONFrom: typeof JSONFrom;
declare const utilsNamespace_JSONTo: typeof JSONTo;
declare const utilsNamespace_assign: typeof assign;
declare const utilsNamespace_base64From: typeof base64From;
declare const utilsNamespace_base64FromBase64URLSafe: typeof base64FromBase64URLSafe;
declare const utilsNamespace_base64FromBuffer: typeof base64FromBuffer;
declare const utilsNamespace_base64To: typeof base64To;
declare const utilsNamespace_base64ToBuffer: typeof base64ToBuffer;
declare const utilsNamespace_base64URLEncode: typeof base64URLEncode;
declare const utilsNamespace_bufferCompare: typeof bufferCompare;
declare const utilsNamespace_bufferConcatenate: typeof bufferConcatenate;
declare const utilsNamespace_bufferFromString: typeof bufferFromString;
declare const utilsNamespace_bufferToString: typeof bufferToString;
declare const utilsNamespace_calculateSecondsInTime: typeof calculateSecondsInTime;
declare const utilsNamespace_cleanObject: typeof cleanObject;
declare const utilsNamespace_copyObject: typeof copyObject;
declare const utilsNamespace_currencyBRToFloat: typeof currencyBRToFloat;
declare const utilsNamespace_dateFirstHourOfDay: typeof dateFirstHourOfDay;
declare const utilsNamespace_dateLastHourOfDay: typeof dateLastHourOfDay;
declare const utilsNamespace_dateToFormat: typeof dateToFormat;
declare const utilsNamespace_debouncer: typeof debouncer;
declare const utilsNamespace_deleteKeys: typeof deleteKeys;
declare const utilsNamespace_generateRandomString: typeof generateRandomString;
declare const utilsNamespace_generateSimpleId: typeof generateSimpleId;
declare const utilsNamespace_getExecutionTime: typeof getExecutionTime;
declare const utilsNamespace_messageDecryptFromChunks: typeof messageDecryptFromChunks;
declare const utilsNamespace_messageEncryptToChunks: typeof messageEncryptToChunks;
declare const utilsNamespace_normalize: typeof normalize;
declare const utilsNamespace_pickKeys: typeof pickKeys;
declare const utilsNamespace_pushLogMessage: typeof pushLogMessage;
declare const utilsNamespace_regexDigitsOnly: typeof regexDigitsOnly;
declare const utilsNamespace_regexLettersOnly: typeof regexLettersOnly;
declare const utilsNamespace_regexReplaceTrim: typeof regexReplaceTrim;
declare const utilsNamespace_removeDuplicatedStrings: typeof removeDuplicatedStrings;
declare const utilsNamespace_sleep: typeof sleep;
declare const utilsNamespace_split: typeof split;
declare const utilsNamespace_stringCompress: typeof stringCompress;
declare const utilsNamespace_stringDecompress: typeof stringDecompress;
declare const utilsNamespace_stringToDate: typeof stringToDate;
declare const utilsNamespace_stringToDateToFormat: typeof stringToDateToFormat;
declare const utilsNamespace_stringToFormat: typeof stringToFormat;
declare const utilsNamespace_stringZLibCompress: typeof stringZLibCompress;
declare const utilsNamespace_stringZLibDecompress: typeof stringZLibDecompress;
declare const utilsNamespace_throttle: typeof throttle;
declare const utilsNamespace_timestamp: typeof timestamp;
declare const utilsNamespace_toString: typeof toString;
declare const utilsNamespace_uint8ArrayFromString: typeof uint8ArrayFromString;
declare const utilsNamespace_uint8ArrayToString: typeof uint8ArrayToString;
declare namespace utilsNamespace {
  export { utilsNamespace_JSONFrom as JSONFrom, utilsNamespace_JSONTo as JSONTo, utilsNamespace_assign as assign, utilsNamespace_base64From as base64From, utilsNamespace_base64FromBase64URLSafe as base64FromBase64URLSafe, utilsNamespace_base64FromBuffer as base64FromBuffer, utilsNamespace_base64To as base64To, utilsNamespace_base64ToBuffer as base64ToBuffer, utilsNamespace_base64URLEncode as base64URLEncode, utilsNamespace_bufferCompare as bufferCompare, utilsNamespace_bufferConcatenate as bufferConcatenate, utilsNamespace_bufferFromString as bufferFromString, utilsNamespace_bufferToString as bufferToString, utilsNamespace_calculateSecondsInTime as calculateSecondsInTime, utilsNamespace_cleanObject as cleanObject, utilsNamespace_copyObject as copyObject, utilsNamespace_currencyBRToFloat as currencyBRToFloat, utilsNamespace_dateFirstHourOfDay as dateFirstHourOfDay, utilsNamespace_dateLastHourOfDay as dateLastHourOfDay, utilsNamespace_dateToFormat as dateToFormat, utilsNamespace_debouncer as debouncer, index$5 as default, utilsNamespace_deleteKeys as deleteKeys, utilsNamespace_generateRandomString as generateRandomString, utilsNamespace_generateSimpleId as generateSimpleId, utilsNamespace_getExecutionTime as getExecutionTime, utilsNamespace_messageDecryptFromChunks as messageDecryptFromChunks, utilsNamespace_messageEncryptToChunks as messageEncryptToChunks, utilsNamespace_normalize as normalize, utilsNamespace_pickKeys as pickKeys, utilsNamespace_pushLogMessage as pushLogMessage, utilsNamespace_regexDigitsOnly as regexDigitsOnly, utilsNamespace_regexLettersOnly as regexLettersOnly, utilsNamespace_regexReplaceTrim as regexReplaceTrim, utilsNamespace_removeDuplicatedStrings as removeDuplicatedStrings, utilsNamespace_sleep as sleep, utilsNamespace_split as split, utilsNamespace_stringCompress as stringCompress, utilsNamespace_stringDecompress as stringDecompress, utilsNamespace_stringToDate as stringToDate, utilsNamespace_stringToDateToFormat as stringToDateToFormat, utilsNamespace_stringToFormat as stringToFormat, utilsNamespace_stringZLibCompress as stringZLibCompress, utilsNamespace_stringZLibDecompress as stringZLibDecompress, utilsNamespace_throttle as throttle, utilsNamespace_timestamp as timestamp, utilsNamespace_toString as toString, utilsNamespace_uint8ArrayFromString as uint8ArrayFromString, utilsNamespace_uint8ArrayToString as uint8ArrayToString };
}

/**
 * @fileoverview Funções para validação de inscrição estadual (CAD/ICMS) do estado do Paraná (PR).
 * Código compatível com Node.js e navegadores.
 */

/**
 * Calcula um dígito verificador com base em uma sequência de dígitos e um array de pesos.
 * Esta é uma função auxiliar interna para evitar a repetição da lógica de cálculo.
 *
 * @param {string} digits - A sequência de dígitos a ser usada no cálculo.
 * @param {number[]} weights - O array de pesos para multiplicar cada dígito.
 * @returns {number} O dígito verificador calculado.
 * @private
 */
function _calculateVerifierDigit$1(digits, weights) {
  // Multiplica cada dígito pelo seu peso correspondente e soma os resultados.
  // O uso de 'reduce' é uma forma funcional e concisa de realizar a soma ponderada.
  const sum = digits
    .split('')
    .reduce((acc, digit, index) => acc + (Number(digit) * weights[index]), 0);

  const remainder = sum % 11;

  // Conforme a regra de cálculo, se o resto for 0 ou 1, o dígito é 0.
  // Caso contrário, é 11 menos o resto.
  return (remainder <= 1) ? 0 : 11 - remainder;
}

/**
 * Valida uma inscrição estadual (CAD/ICMS) do estado do Paraná (PR).
 * A função lida com entradas formatadas (com pontos, traços) e não formatadas,
 * desde que contenham a quantidade correta de dígitos.
 *
 * @summary Valida o CAD/ICMS do estado do Paraná.
 * @param {string | number} cadicms O valor do CAD/ICMS a ser validado.
 * @returns {boolean} Retorna `true` se o CAD/ICMS for válido, e `false` caso contrário.
 * @example
 * // Exemplo com números e strings formatadas/não formatadas
 * validateCADICMSPR("90312851-11"); // true
 * validateCADICMSPR("9031285111");  // true
 * validateCADICMSPR(9031285111);   // true
 * validateCADICMSPR("1234567890");  // false
 */
function validateCADICMSPR(cadicms) {
  // Garante que a entrada seja uma string e remove todos os caracteres não numéricos.
  // O construtor String() lida de forma segura com null, undefined e outros tipos.
  const digitsOnly = String(cadicms).replace(/[^\d]/g, '');

  // Define o tamanho esperado para a inscrição estadual.
  const CADICMS_LENGTH = 10;

  // A inscrição estadual deve ter no máximo 10 dígitos e não pode estar vazia.
  // A validação original permite números menores que 10 e os preenche com zeros,
  // essa lógica é mantida.
  if (digitsOnly === '' || digitsOnly.length > CADICMS_LENGTH) {
    return false;
  }

  // Se a string for menor que 10, preenche com zeros à esquerda até atingir o tamanho correto.
  const paddedCadicms = digitsOnly.padStart(CADICMS_LENGTH, '0');

  // --- Cálculo do Primeiro Dígito Verificador ---

  // Pesos para o cálculo do primeiro dígito (baseado nos 8 primeiros dígitos da inscrição).
  const WEIGHTS_DV1 = [3, 2, 7, 6, 5, 4, 3, 2];
  const firstEightDigits = paddedCadicms.substring(0, 8);
  const expectedFirstVerifier = _calculateVerifierDigit$1(firstEightDigits, WEIGHTS_DV1);

  // Compara o dígito calculado com o nono dígito da inscrição.
  // A conversão para Number() garante uma comparação estrita de tipos.
  const firstVerifier = Number(paddedCadicms[8]);
  if (expectedFirstVerifier !== firstVerifier) {
    return false;
  }

  // --- Cálculo do Segundo Dígito Verificador ---

  // Pesos para o cálculo do segundo dígito (baseado nos 9 primeiros dígitos da inscrição).
  const WEIGHTS_DV2 = [4, 3, 2, 7, 6, 5, 4, 3, 2];
  const firstNineDigits = paddedCadicms.substring(0, 9);
  const expectedSecondVerifier = _calculateVerifierDigit$1(firstNineDigits, WEIGHTS_DV2);

  // Compara o dígito calculado com o décimo (último) dígito da inscrição.
  const secondVerifier = Number(paddedCadicms[9]);
  
  // O retorno final é o resultado da comparação do segundo dígito.
  return expectedSecondVerifier === secondVerifier;
}

// ------------------------------------------------------------------------------------------------

/**
 * @fileoverview Fornece uma função para validar CEP (Código de Endereçamento Postal).
 */

/**
 * Valida um CEP (Código de Endereçamento Postal).
 *
 * @summary Valida um CEP.
 * @description A função verifica se a entrada consiste em exatamente 8 dígitos numéricos,
 * ignorando caracteres de máscara.
 *
 * @param {string | number} cep O CEP a ser validado.
 * @returns {boolean} Retorna `true` se o CEP for válido, e `false` caso contrário.
 * @example
 * validateCEP("80000-123"); // true
 * validateCEP("1234567");   // false
 */
function validateCEP(cep = "") {
  const digitsOnly = String(cep).replace(/[^\d]/g, "");
  return digitsOnly.length === 8;
}
// ------------------------------------------------------------------------------------------------

/**
 * @fileoverview Fornece uma função para validar números de CNPJ (Cadastro Nacional da Pessoa Jurídica).
 * O código é compatível com ambientes Node.js e navegadores.
 */

/**
 * Array de pesos utilizado no algoritmo de cálculo dos dígitos verificadores do CNPJ.
 * @private
 * @type {number[]}
 */
const DEFAULT_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

/**
 * Calcula o valor numérico de um caractere para o algoritmo de soma ponderada.
 * A conversão é baseada no valor ASCII do caractere, o que resulta em um
 * mapeamento específico para letras (ex: 'A' => 17, 'B' => 18).
 *
 * @private
 * @param {string} char - O caractere a ser convertido.
 * @returns {number} O valor numérico correspondente para o cálculo.
 */
function _getCharValue(char) {
  // A subtração do charCode de '0' é o método que define a conversão.
  return char.charCodeAt(0) - '0'.charCodeAt(0);
}

/**
 * Calcula os dois dígitos verificadores para uma base de 12 caracteres de um CNPJ.
 *
 * @private
 * @param {string} baseCnpj - Os 12 primeiros caracteres do CNPJ.
 * @param {number[]} weights - O array de pesos a ser usado no cálculo.
 * @returns {string} Uma string contendo os dois dígitos verificadores calculados.
 */
function _calculateVerifierDigits(baseCnpj, weights) {
  /**
   * Calcula um único dígito verificador a partir do resultado de uma soma ponderada.
   * @param {number} sum - A soma ponderada.
   * @returns {number} O dígito verificador (0 a 9).
   */
  const getDigit = (sum) => {
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  let sum1 = 0;
  let sum2 = 0;

  for (let i = 0; i < baseCnpj.length; i++) {
    // Converte o caractere para seu valor numérico específico do algoritmo.
    const value = _getCharValue(baseCnpj[i]);
    sum1 += value * weights[i + 1];
    sum2 += value * weights[i];
  }

  const dv1 = getDigit(sum1);
  sum2 += dv1 * weights[baseCnpj.length]; // Adiciona o primeiro dígito ao cálculo do segundo.
  const dv2 = getDigit(sum2);

  return `${dv1}${dv2}`;
}

/**
 * Valida um número de CNPJ (Cadastro Nacional da Pessoa Jurídica).
 *
 * @summary Valida um CNPJ, com suporte a formatos alfanuméricos.
 * @description A função suporta o formato numérico padrão e o futuro formato alfanumérico.
 * A entrada pode conter ou não os caracteres de máscara comuns ('.', '/', '-').
 *
 * @param {string | number} cnpj O CNPJ a ser validado.
 * @param {object} [options={}] Opções de configuração para a validação.
 * @param {string} [options.addPaddingChar="0"] Caractere a ser usado para preencher a entrada até 14 caracteres.
 * @param {number[]} [options.weights=DEFAULT_WEIGHTS] Array de pesos para o cálculo dos dígitos verificadores.
 * @param {boolean} [options.ignoreToUpperCase=true] Se `false`, a entrada é convertida para maiúsculas. Se `true`, a validação diferencia maiúsculas de minúsculas.
 * @param {boolean} [options.ignorePadding=false] Se `true`, a função não adiciona preenchimento, validando a entrada como está.
 * @returns {boolean} Retorna `true` se o CNPJ for válido, e `false` caso contrário.
 */
function validateCNPJ(cnpj = "", options = {}) {
  // 1. Normalização e Configuração
  let processedCnpj = String(cnpj).replace(/[./-]/g, "");

  const finalOptions = {
    addPaddingChar: "0",
    weights: DEFAULT_WEIGHTS,
    ignorePadding: false,
    ignoreToUpperCase: true,
    ...options,
  };

  // A conversão para maiúsculas é um comportamento opcional controlado via `options`.
  if (finalOptions.ignoreToUpperCase === false) {
    processedCnpj = processedCnpj.toUpperCase();
  }

  if (!finalOptions.ignorePadding) {
    processedCnpj = processedCnpj.padStart(14, finalOptions.addPaddingChar);
  }

  // 2. Regras de Validação de Formato e Casos Inválidos

  // O CNPJ deve consistir em 12 caracteres alfanuméricos (base) e 2 dígitos (verificadores).
  const regexCNPJ = /^([A-Z\d]){12}(\d){2}$/;
  if (!regexCNPJ.test(processedCnpj)) {
    return false;
  }
  
  // Para CNPJs puramente numéricos, sequências de dígitos repetidos são inválidas (ex: '111...').
  if (/^\d+$/.test(processedCnpj) && /^(\d)\1{13}$/.test(processedCnpj)) {
    return false;
  }

  // 3. Cálculo e Verificação Final
  const baseDigits = processedCnpj.substring(0, 12);
  const verifierDigits = processedCnpj.substring(12);

  const calculatedVerifierDigits = _calculateVerifierDigits(baseDigits, finalOptions.weights);

  return verifierDigits === calculatedVerifierDigits;
}

// ------------------------------------------------------------------------------------------------

/**
 * @fileoverview Fornece uma função para validar números de CPF (Cadastro de Pessoas Físicas).
 * O código é compatível com ambientes Node.js e navegadores.
 */

/**
 * Calcula um dígito verificador de CPF a partir de uma base de dígitos.
 * O algoritmo é o mesmo para o primeiro e o segundo dígito, variando apenas o tamanho da base.
 *
 * @private
 * @param {string} baseDigits - A sequência de dígitos para o cálculo (9 para o 1º dígito, 10 para o 2º).
 * @returns {number} O dígito verificador calculado.
 */
function _calculateVerifierDigit(baseDigits) {
  // O peso inicial é o tamanho da base + 1 (10 para o 1º dígito, 11 para o 2º).
  const initialWeight = baseDigits.length + 1;

  // Calcula a soma ponderada dos dígitos.
  const sum = baseDigits
    .split('')
    .reduce((acc, digit, index) => acc + (Number(digit) * (initialWeight - index)), 0);

  const remainder = sum % 11;

  // Se o resto da divisão for menor que 2, o dígito é 0; caso contrário, é 11 menos o resto.
  return remainder < 2 ? 0 : 11 - remainder;
}

/**
 * Valida um número de CPF (Cadastro de Pessoas Físicas).
 *
 * @summary Valida um CPF, numérico ou com máscara.
 * @description A função remove caracteres de máscara, verifica casos inválidos conhecidos
 * e calcula os dois dígitos verificadores para confirmar a validade do CPF.
 *
 * @param {string | number} cpf O número de CPF a ser validado.
 * @returns {boolean} Retorna `true` se o CPF for válido, e `false` caso contrário.
 * @example
 * validateCPF("123.456.789-00"); // Exemplo válido
 * validateCPF("111.111.111-11"); // Retorna false
 */
function validateCPF(cpf = "") {
  // 1. Normalização da Entrada
  const digitsOnly = String(cpf).replace(/[^\d]/g, '');

  const CPF_LENGTH = 11;

  // Rejeita a entrada se, após a limpeza, estiver vazia ou com mais de 11 dígitos.
  if (digitsOnly === '' || digitsOnly.length > CPF_LENGTH) {
    return false;
  }

  // Garante que a string tenha 11 dígitos, preenchendo com zeros à esquerda se necessário.
  const paddedCpf = digitsOnly.padStart(CPF_LENGTH, '0');

  // 2. Verificação de Casos Inválidos
  // CPFs com todos os dígitos iguais são inválidos. A regex /^(\d)\1{10}$/ checa essa condição.
  if (/^(\d)\1{10}$/.test(paddedCpf)) {
    return false;
  }

  // 3. Cálculo e Validação dos Dígitos
  const baseDv1 = paddedCpf.substring(0, 9);
  const expectedDv1 = _calculateVerifierDigit(baseDv1);

  // Compara o primeiro dígito verificador calculado com o fornecido.
  if (expectedDv1 !== Number(paddedCpf[9])) {
    return false;
  }

  const baseDv2 = paddedCpf.substring(0, 10);
  const expectedDv2 = _calculateVerifierDigit(baseDv2);

  // Compara o segundo dígito e retorna o resultado final da validação.
  return expectedDv2 === Number(paddedCpf[10]);
}

// ------------------------------------------------------------------------------------------------

/**
 * @fileoverview Fornece uma função para validar endereços de e-mail.
 * O código é compatível com ambientes Node.js e navegadores.
 */

/**
 * Expressão regular para validar a maioria dos formatos de e-mail padrão.
 * Definida como uma constante fora da função para evitar a recompilação a cada
 * chamada, o que melhora a performance.
 * @private
 * @type {RegExp}
 */
const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Valida um endereço de e-mail com base em um formato padrão.
 *
 * @summary Valida um endereço de e-mail.
 * @description A função verifica se a string fornecida corresponde a um formato de e-mail
 * comum, cobrindo a maioria dos casos de uso padrão (ex: `usuario@dominio.com`).
 *
 * @param {string | any} email O valor a ser verificado. A função o converterá para string.
 * @returns {boolean} Retorna `true` se o e-mail tiver um formato válido, e `false` caso contrário.
 * @example
 * validateEmail("contato@exemplo.com"); // true
 * validateEmail("email-invalido");       // false
 */
function validateEmail(email = "") {
  // Converte a entrada para string para garantir que o método .test() funcione.
  const emailAsString = String(email);

  // Testa a string contra a expressão regular pré-compilada.
  return EMAIL_REGEX.test(emailAsString);
}

// ------------------------------------------------------------------------------------------------

/**
 * @fileoverview Fornece uma função para validar Chaves PIX.
 */


/**
 * Regex para validar um UUID v4 (formato da Chave Aleatória PIX).
 * @private
 */
const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Regex para validar um número de telefone brasileiro no formato PIX (+55DDXXXXXXXXX).
 * @private
 */
// Versão Oficial: Aceita 10 (fixo) ou 11 (celular) dígitos após o +55.
const PIX_PHONE_REGEX = /^\+55\d{10,11}$/;

/**
 * @summary Valida uma Chave PIX de qualquer tipo, incluindo CNPJ alfanumérico.
 * @description
 * A função verifica se a chave fornecida corresponde a um dos cinco formatos
 * válidos de Chave PIX, delegando a validação de CPF, CNPJ e E-mail para as
 * funções correspondentes.
 *
 * @param {string} [chave=""] - A Chave PIX a ser validada.
 * @returns {boolean} Retorna `true` se a chave for válida, e `false` caso contrário.
 *
 * @example
 * validateChavePix("meu.email@valido.com"); // true
 * validateChavePix("11122233344");         // true (se for um CPF válido)
 * validateChavePix("+5511987654321");      // true (celular)
 * validateChavePix("+554133334444");       // true (fixo)
 */
function validateChavePix(chave = "") {
  // Converte a entrada para string e remove espaços das pontas.
  const keyAsString = String(chave || "").trim();

  // Uma chave PIX não pode ser vazia.
  if (keyAsString === "") {
    return false;
  }

  // A ordem de verificação é importante para performance e para evitar ambiguidades.
  if (UUID_V4_REGEX.test(keyAsString)) return true;
  if (PIX_PHONE_REGEX.test(keyAsString)) return true;
  if (keyAsString.includes("@")) return validateEmail(keyAsString);
  
  // Para os formatos restantes (CPF/CNPJ), delega a validação.
  if (validateCPF(keyAsString)) {
    return true;
  }
  
  if (validateCNPJ(keyAsString)) {
    return true;
  }

  // Se não se encaixou em nenhum formato, é inválida.
  return false;
}

/**
 * @fileoverview Fornece uma função para validar números de CNH.
 */

/**
 * Pesos para o cálculo do primeiro e segundo dígito verificador da CNH.
 * @private
 */
const CNH_WEIGHTS_DV1 = [9, 8, 7, 6, 5, 4, 3, 2, 1];
const CNH_WEIGHTS_DV2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Valida um número de CNH (Carteira Nacional de Habilitação).
 *
 * @summary Valida um número de CNH.
 * @description A função verifica o formato, a regra de dígitos repetidos e calcula os
 * dois dígitos verificadores para confirmar a validade do número.
 *
 * @param {string | number} cnh O número da CNH a ser validado.
 * @returns {boolean} Retorna `true` se a CNH for válida, e `false` caso contrário.
 */
function validateCNH(cnh = "") {
  const digitsOnly = String(cnh).replace(/[^\d]/g, "");

  if (digitsOnly.length !== 11 || /^(\d)\1{10}$/.test(digitsOnly)) {
    return false;
  }

  const base = digitsOnly.substring(0, 9);
  const verifierDigits = digitsOnly.substring(9);

  // --- Cálculo do primeiro dígito ---
  const sum1 = base
    .split("")
    .reduce(
      (acc, digit, index) => acc + Number(digit) * CNH_WEIGHTS_DV1[index],
      0
    );

  const remainder1 = sum1 % 11;
  const calculatedDv1 = remainder1 >= 10 ? 0 : remainder1;

  if (calculatedDv1 !== Number(verifierDigits[0])) {
    return false;
  }

  // --- Cálculo do segundo dígito ---
  const sum2 = base
    .split("")
    .reduce(
      (acc, digit, index) => acc + Number(digit) * CNH_WEIGHTS_DV2[index],
      0
    );

  const remainder2 = sum2 % 11;
  const calculatedDv2 = remainder2 >= 10 ? 0 : remainder2;

  return calculatedDv2 === Number(verifierDigits[1]);
}
// ------------------------------------------------------------------------------------------------

/**
 * @fileoverview Fornece uma função para validar números de PIS/PASEP/NIT.
 */

/**
 * Array de pesos utilizado no algoritmo de cálculo do dígito verificador.
 * @private
 * @type {number[]}
 */
const PIS_WEIGHTS = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

/**
 * Valida um número de PIS/PASEP/NIT.
 *
 * @summary Valida um número de PIS/PASEP/NIT.
 * @description A função verifica o formato, a regra de dígitos repetidos e o dígito
 * verificador para confirmar a validade do número.
 *
 * @param {string | number} pis O número a ser validado.
 * @returns {boolean} Retorna `true` se o número for válido, e `false` caso contrário.
 * @example
 * validatePISPASEPNIT("120.12345.67-8"); // true
 * validatePISPASEPNIT("11111111111");    // false
 */
function validatePISPASEPNIT(pis = "") {
  const digitsOnly = String(pis).replace(/[^\d]/g, "");

  if (digitsOnly.length !== 11 || /^(\d)\1{10}$/.test(digitsOnly)) {
    return false;
  }

  const base = digitsOnly.substring(0, 10);
  const verifierDigit = Number(digitsOnly[10]);

  const sum = base
    .split("")
    .reduce((acc, digit, index) => acc + Number(digit) * PIS_WEIGHTS[index], 0);

  const remainder = sum % 11;
  const calculatedDigit = remainder < 2 ? 0 : 11 - remainder;

  return verifierDigit === calculatedDigit;
}
// ------------------------------------------------------------------------------------------------

/**
 * @fileoverview Fornece uma função para validar códigos de RENAVAM.
 */

/**
 * Array de pesos utilizado no cálculo do dígito verificador do RENAVAM.
 * @private
 * @type {number[]}
 */
const RENAVAM_WEIGHTS = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3];

/**
 * Valida um código de RENAVAM (Registro Nacional de Veículos Automotores).
 *
 * @summary Valida um código de RENAVAM.
 * @description A função valida o formato de 11 dígitos (preenchendo com zeros se
 * necessário) e calcula o dígito verificador para confirmar sua validade.
 *
 * @param {string | number} renavam O código a ser validado.
 * @returns {boolean} Retorna `true` se o RENAVAM for válido, e `false` caso contrário.
 */
function validateRENAVAM(renavam = "") {
  const digitsOnly = String(renavam).replace(/[^\d]/g, "").padStart(11, "0");

  if (digitsOnly.length !== 11 || /^(\d)\1{10}$/.test(digitsOnly)) {
    return false;
  }

  const base = digitsOnly.substring(0, 10);
  const verifierDigit = Number(digitsOnly[10]);

  const reversedBase = base.split("").reverse();

  const sum = reversedBase.reduce(
    (acc, digit, index) => acc + Number(digit) * RENAVAM_WEIGHTS[index],
    0
  );

  const remainder = sum % 11;
  const calculatedDigit = remainder <= 1 ? 0 : 11 - remainder;

  return verifierDigit === calculatedDigit;
}
// ------------------------------------------------------------------------------------------------

/**
 * @fileoverview Fornece uma função para validar números de Título de Eleitor.
 */

/**
 * Pesos para o cálculo do primeiro dígito verificador.
 * @private
 */
const TITULO_WEIGHTS_DV1 = [2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Valida um número de Título de Eleitor.
 *
 * @summary Valida um número de Título de Eleitor.
 * @description A função valida o formato de 12 dígitos e calcula ambos os dígitos
 * verificadores, considerando as regras especiais baseadas no estado de emissão.
 *
 * @param {string | number} titulo O número do título a ser validado.
 * @returns {boolean} Retorna `true` se o título for válido, e `false` caso contrário.
 */
function validateTituloEleitor(titulo = "") {
  // Verifica se o parâmetro é nulo ou indefinido
  if (titulo == null) {
    return false;
  }

  const digitsOnly = String(titulo).replace(/[^\d]/g, "").padStart(12, "0");

  if (digitsOnly.length !== 12) {
    return false;
  }

  const base = digitsOnly.substring(0, 8);
  const stateCode = Number(digitsOnly.substring(8, 10));
  const verifierDigits = digitsOnly.substring(10);

  // O código de estado deve ser válido (entre 1 e 28)
  if (stateCode < 1 || stateCode > 28) {
    return false;
  }

  // --- Cálculo do primeiro dígito verificador ---
  const sum1 = base
    .split("")
    .reduce(
      (acc, digit, index) => acc + Number(digit) * TITULO_WEIGHTS_DV1[index],
      0
    );

  let remainder1 = sum1 % 11;
  let calculatedDv1;

  // Regras para o primeiro DV baseadas na documentação oficial:
  // - Se resto for 0: para SP (01) e MG (02) é 1, para outros estados é 0
  // - Se resto for maior que 9: é 0
  // - Nos outros casos: é o próprio resto
  if (remainder1 === 0) {
    calculatedDv1 = (stateCode === 1 || stateCode === 2) ? 1 : 0;
  } else if (remainder1 > 9) {
    calculatedDv1 = 0;
  } else {
    calculatedDv1 = remainder1;
  }

  if (calculatedDv1 !== Number(verifierDigits[0])) {
    return false;
  }

  // --- Cálculo do segundo dígito verificador ---
  const digit1 = Number(digitsOnly.substring(8, 9)); // Primeiro dígito do código do estado
  const digit2 = Number(digitsOnly.substring(9, 10)); // Segundo dígito do código do estado
  
  const sum2 = (digit1 * 7) + (digit2 * 8) + (calculatedDv1 * 9);

  let remainder2 = sum2 % 11;
  let calculatedDv2;
  
  // Mesma lógica do primeiro dígito verificador.
  if (remainder2 === 0) {
    calculatedDv2 = (stateCode === 1 || stateCode === 2) ? 1 : 0;
  } else if (remainder2 > 9) {
    calculatedDv2 = 0;
  } else {
    calculatedDv2 = remainder2;
  }

  return calculatedDv2 === Number(verifierDigits[1]);
}
// ------------------------------------------------------------------------------------------------

/**
 * @fileoverview Fornece uma função para validar números de RG (Registro Geral) brasileiro.
 */

/**
 * Pesos para o cálculo do dígito verificador do RG.
 * Os fatores multiplicadores crescem da esquerda para a direita, iniciando em 2.
 * @private
 */
const RG_WEIGHTS = [2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Valida um número de RG (Registro Geral) brasileiro.
 *
 * @summary Valida um número de RG brasileiro usando o algoritmo de módulo 11.
 * @description A função valida o formato de 8 dígitos seguido por um dígito verificador,
 * que pode ser um número (0-9) ou a letra 'X' quando o cálculo resulta em 10.
 * Remove automaticamente pontuação e formatação do input.
 *
 * @param {string | number} rg O número do RG a ser validado (com ou sem formatação).
 * @returns {boolean} Retorna `true` se o RG for válido, e `false` caso contrário.
 *
 * @example
 * validateRG('24.678.131-4'); // true
 * validateRG('37.606.335-X'); // true
 * validateRG('45.727.503-0'); // true
 * validateRG('123456789'); // false
 * validateRG('24678131X'); // false (dígito verificador incorreto)
 */
function validateRG(rg = "") {
  // Verifica se o parâmetro é nulo ou indefinido
  if (rg == null) {
    return false;
  }

  // Remove toda formatação, mantendo apenas números e a letra X
  const cleanRG = String(rg)
    .toUpperCase()
    .replace(/[^\dX]/g, "");

  // RG deve ter exatamente 9 caracteres (8 dígitos + 1 verificador)
  if (cleanRG.length !== 9) {
    return false;
  }

  // Extrai os 8 primeiros dígitos (base) e o dígito verificador
  const base = cleanRG.substring(0, 8);
  const verifierDigit = cleanRG.substring(8);

  // Verifica se a base contém apenas dígitos
  if (!/^\d{8}$/.test(base)) {
    return false;
  }

  // Verifica se o dígito verificador é válido (0-9 ou X)
  if (!/^[\dX]$/.test(verifierDigit)) {
    return false;
  }

  // Verifica se todos os dígitos da base são iguais (RG inválido por convenção)
  if (/^(\d)\1{7}$/.test(base)) {
    return false;
  }

  // --- Cálculo do dígito verificador usando módulo 11 ---
  
  // Multiplica cada dígito pelo seu peso correspondente
  const sum = base
    .split("")
    .reduce((acc, digit, index) => {
      return acc + (Number(digit) * RG_WEIGHTS[index]);
    }, 0);

  // Calcula o resto da divisão por 11
  const remainder = sum % 11;
  
  // Calcula o complemento (11 - resto)
  const complement = 11 - remainder;
  
  // Determina o dígito verificador calculado
  let calculatedDigit;
  
  if (complement === 10) {
    // Quando o complemento é 10, o dígito verificador é 'X'
    calculatedDigit = 'X';
  } else if (complement === 11) {
    // Quando o complemento é 11, o dígito verificador é '0'
    calculatedDigit = '0';
  } else {
    // Para outros casos, o dígito verificador é o próprio complemento
    calculatedDigit = String(complement);
  }

  // Compara o dígito calculado com o fornecido
  return calculatedDigit === verifierDigit;
}
// ------------------------------------------------------------------------------------------------

// Default export para compatibilidade
var index$4 = {
  validateCADICMSPR,
  validateCEP,
  validateChavePix,
  validateCNH,
  validateCNPJ,
  validateCPF,
  validateEmail,
  validatePISPASEPNIT,
  validateRenavam: validateRENAVAM,
  validateTituloEleitor,
  validateRG,
};

declare const validatorsNamespace_validateCADICMSPR: typeof validateCADICMSPR;
declare const validatorsNamespace_validateCEP: typeof validateCEP;
declare const validatorsNamespace_validateCNH: typeof validateCNH;
declare const validatorsNamespace_validateCNPJ: typeof validateCNPJ;
declare const validatorsNamespace_validateCPF: typeof validateCPF;
declare const validatorsNamespace_validateChavePix: typeof validateChavePix;
declare const validatorsNamespace_validateEmail: typeof validateEmail;
declare const validatorsNamespace_validatePISPASEPNIT: typeof validatePISPASEPNIT;
declare const validatorsNamespace_validateRG: typeof validateRG;
declare const validatorsNamespace_validateTituloEleitor: typeof validateTituloEleitor;
declare namespace validatorsNamespace {
  export { index$4 as default, validatorsNamespace_validateCADICMSPR as validateCADICMSPR, validatorsNamespace_validateCEP as validateCEP, validatorsNamespace_validateCNH as validateCNH, validatorsNamespace_validateCNPJ as validateCNPJ, validatorsNamespace_validateCPF as validateCPF, validatorsNamespace_validateChavePix as validateChavePix, validatorsNamespace_validateEmail as validateEmail, validatorsNamespace_validatePISPASEPNIT as validatePISPASEPNIT, validatorsNamespace_validateRG as validateRG, validateRENAVAM as validateRenavam, validatorsNamespace_validateTituloEleitor as validateTituloEleitor };
}

// ------------------------------------------------------------------------------------------------

/**
 * Asynchronously decrypts an encrypted message using a provided private key.
 * 
 * This function performs RSA-OAEP decryption using the Web Crypto API, supporting both
 * Node.js and browser environments. It handles PEM-formatted private keys and base64-encoded
 * encrypted messages, providing a secure and efficient decryption process.
 *
 * @async
 * @function decrypt
 * @param {string} privateKey - The PEM-encoded private key used for decryption
 * @param {string} encryptedMessage - The base64-encoded encrypted message to decrypt
 * @param {Object} [props={}] - Configuration options for the decryption process
 * @param {string} [props.format="pkcs8"] - Private key format specification
 * @param {Object} [props.algorithm] - Cryptographic algorithm configuration
 * @param {string} [props.algorithm.name="RSA-OAEP"] - Algorithm name
 * @param {Object} [props.algorithm.hash] - Hash algorithm configuration
 * @param {string} [props.algorithm.hash.name="SHA-256"] - Hash algorithm name
 * @param {boolean} [props.extractable=true] - Whether the imported key can be extracted
 * @param {string[]} [props.keyUsages=["decrypt"]] - Permitted key usage operations
 * @param {string} [props.padding="RSA-OAEP"] - Padding scheme for decryption operation
 * @returns {Promise<string>} The decrypted message as a UTF-8 string
 * @throws {Error} When decryption fails due to invalid key, corrupted data, or crypto errors
 * 
 * @example
 * const decryptedText = await decrypt(pemPrivateKey, base64EncryptedMessage);
 * 
 * @example
 * const decryptedText = await decrypt(pemPrivateKey, base64EncryptedMessage, {
 *   algorithm: { name: "RSA-OAEP", hash: { name: "SHA-1" } },
 *   extractable: false
 * });
 */
async function decrypt(privateKey, encryptedMessage, props = {}) {
  // Early return for empty encrypted messages to avoid unnecessary processing
  if (!encryptedMessage) {
    return "";
  }

  // Destructure configuration with optimized defaults
  const {
    format = "pkcs8",
    algorithm = { name: "RSA-OAEP", hash: { name: "SHA-256" } },
    extractable = true,
    keyUsages = ["decrypt"],
    padding = "RSA-OAEP"
  } = props || {};

  // Get crypto implementation (Node.js or browser)
  const crypto = getCrypto();

  // Clean and convert PEM private key to binary format
  // Removes PEM headers, footers, and whitespace in a single operation
  const cleanedPrivateKey = privateKey.replace(
    /-----(BEGIN|END) (?:RSA )?(?:PRIVATE|PUBLIC) KEY-----|\s/g,
    ""
  );
  const binaryPrivateKey = base64ToBuffer(cleanedPrivateKey);

  // Import the private key for cryptographic operations
  const importedKey = await importCryptoKey(
    format,
    binaryPrivateKey,
    algorithm,
    extractable,
    keyUsages
  );

  // Convert base64 encrypted message to binary data
  const encryptedData = base64ToBuffer(encryptedMessage);

  // Perform decryption using the Web Crypto API
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: padding },
    importedKey,
    encryptedData
  );

  // Convert decrypted binary data back to string
  return bufferToString(decryptedBuffer);
}

// ------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------

/**
 * Encrypts a message using asymmetric cryptography with public key encryption.
 *
 * This function provides a complete encryption workflow that handles PEM-formatted
 * public keys, performs key importation, and encrypts plaintext messages using
 * industry-standard cryptographic algorithms. It supports various RSA encryption
 * schemes and is designed for secure data transmission scenarios where the sender
 * has access to the recipient's public key.
 *
 * The function automatically handles key format conversion from PEM to binary,
 * imports the key into the Web Crypto API, performs the encryption operation,
 * and returns the result as a base64-encoded string for easy transmission.
 *
 * @async
 * @param {string} publicKey - The public key in PEM format for encryption:
 *                            - Must be a valid PEM-encoded public key string
 *                            - Supports standard PEM headers (BEGIN/END PUBLIC KEY)
 *                            - Can include RSA-specific headers (BEGIN/END RSA PUBLIC KEY)
 *                            - Whitespace and line breaks are automatically handled
 *                            - Key should be compatible with the specified algorithm
 *
 * @param {string} message - The plaintext message to encrypt:
 *                          - UTF-8 encoded string that will be converted to binary
 *                          - Empty strings are handled gracefully (returns empty result)
 *                          - Message length is limited by the key size and padding:
 *                            - RSA-OAEP with 2048-bit key: ~190 bytes max
 *                            - RSA-OAEP with 4096-bit key: ~446 bytes max
 *                          - For larger messages, consider hybrid encryption approaches
 *
 * @param {Object} [props={}] - Configuration options for encryption parameters:
 * @param {string} [props.format='spki'] - Public key import format:
 *                            - 'spki': SubjectPublicKeyInfo format (most common for public keys)
 *                            - 'raw': Raw key data (not typical for RSA keys)
 *                            - 'jwk': JSON Web Key format
 *
 * @param {Object} [props.algorithm] - Cryptographic algorithm specification:
 *                            Default: { name: 'RSA-OAEP', hash: { name: 'SHA-256' } }
 *                            Supported algorithms:
 *                            - RSA-OAEP: Optimal Asymmetric Encryption Padding
 *                            - RSA-PKCS1-v1_5: PKCS#1 v1.5 padding (legacy, less secure)
 *                            Hash options: SHA-1, SHA-256, SHA-384, SHA-512
 *
 * @param {boolean} [props.extractable=true] - Key extractability setting:
 *                            - true: Key can be exported after import (default)
 *                            - false: Key cannot be extracted (more secure)
 *                            - Generally safe to leave as true for public keys
 *
 * @param {string[]} [props.keyUsages=['encrypt']] - Permitted key operations:
 *                            - ['encrypt']: Only encryption operations (default)
 *                            - ['encrypt', 'wrapKey']: Encryption and key wrapping
 *                            - Must include 'encrypt' for this function to work
 *
 * @param {string} [props.padding='RSA-OAEP'] - Encryption padding scheme:
 *                            - 'RSA-OAEP': Optimal Asymmetric Encryption Padding (recommended)
 *                            - 'RSA-PKCS1-v1_5': PKCS#1 v1.5 padding (legacy)
 *                            - Should match the algorithm.name parameter
 *
 * @returns {Promise<string>} Promise resolving to encrypted data:
 *                           - Base64-encoded string representation of encrypted bytes
 *                           - Ready for transmission over text-based protocols
 *                           - Can be stored safely in JSON, XML, or database text fields
 *                           - Returns empty string if input message is empty
 *
 * @throws {Error} Throws an error when:
 *                 - Public key is malformed or invalid PEM format
 *                 - Key is incompatible with the specified algorithm
 *                 - Message exceeds maximum size for the key/padding combination
 *                 - Cryptographic operation fails due to invalid parameters
 *                 - Required crypto modules are unavailable in the environment
 *
 * @example
 * // Basic RSA-OAEP encryption with default parameters
 * const publicKeyPem = `-----BEGIN PUBLIC KEY-----
 * MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
 * -----END PUBLIC KEY-----`;
 *
 * const encrypted = await encrypt(publicKeyPem, 'Hello, World!');
 * console.log('Encrypted message:', encrypted);
 *
 * @example
 * // Advanced encryption with custom algorithm parameters
 * const customEncrypted = await encrypt(
 *   publicKeyPem,
 *   'Sensitive data',
 *   {
 *     algorithm: {
 *       name: 'RSA-OAEP',
 *       hash: { name: 'SHA-512' }
 *     },
 *     extractable: false,
 *     keyUsages: ['encrypt'],
 *     padding: 'RSA-OAEP'
 *   }
 * );
 *
 * @example
 * // Handle encryption errors gracefully
 * try {
 *   const result = await encrypt(publicKey, message);
 *   // Transmit or store the encrypted result
 *   await sendSecureMessage(result);
 * } catch (error) {
 *   console.error('Encryption failed:', error.message);
 *   // Implement fallback or error reporting
 * }
 *
 * @example
 * // Empty message handling
 * const emptyResult = await encrypt(publicKey, '');
 * console.log(emptyResult === ''); // true
 */
async function encrypt(publicKey, message, props = {}) {
  // Handle empty message case early for performance
  if (!message) return "";

  // Extract crypto module for the current environment
  const crypto = getCrypto();

  // Clean and convert PEM-formatted public key to binary format
  // Remove PEM headers, footers, and whitespace to get pure base64 content
  const cleanedPublicKey = publicKey.replace(
    /(-----(BEGIN|END) (RSA )?(PRIVATE|PUBLIC) KEY-----|\s)/g,
    ""
  );
  const binaryPublicKey = base64ToBuffer(cleanedPublicKey);

  const {
    format = "spki",
    algorithm = { name: "RSA-OAEP", hash: { name: "SHA-256" } },
    extractable = true,
    keyUsages = ["encrypt"],
    padding = "RSA-OAEP",
  } = props || {};

  // Import the public key into Web Crypto API format
  // Use provided parameters or sensible defaults for RSA-OAEP encryption
  const importedKey = await importCryptoKey(
    format || "spki",
    binaryPublicKey,
    algorithm || {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    extractable !== undefined ? extractable : true,
    keyUsages || ["encrypt"]
  );

  // Convert message string to binary format for encryption
  const messageBuffer = bufferFromString(message);

  // Perform the actual encryption operation using the imported key
  // The padding parameter determines the encryption scheme used
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: padding || "RSA-OAEP" },
    importedKey,
    messageBuffer
  );

  // Convert encrypted binary data to base64 for safe text transmission
  return base64FromBuffer(encryptedBuffer);
}

// ------------------------------------------------------------------------------------------------

/**
 * Computes a cryptographic hash (digest) of the given data using the specified algorithm.
 * 
 * This function provides a unified interface for cryptographic hashing that works seamlessly
 * across both Node.js and browser environments. It automatically handles string-to-binary
 * conversion and selects the appropriate hashing implementation based on the runtime environment.
 *
 * @async
 * @function digest
 * @param {string} algorithm - The hash algorithm identifier (e.g., 'SHA-256', 'SHA-1', 'SHA-512')
 * @param {string|Uint8Array} data - The input data to hash - string or binary array
 * @returns {Promise<Uint8Array>} The computed cryptographic hash as a Uint8Array
 * @throws {Error} When the algorithm is unsupported or hashing operation fails
 *
 * @example
 * // Hash a string using SHA-256
 * const hash = await digest('SHA-256', 'hello world');
 * console.log(Array.from(hash).map(b => b.toString(16).padStart(2, '0')).join(''));
 *
 * @example
 * // Hash binary data using SHA-1
 * const binaryData = new Uint8Array([72, 101, 108, 108, 111]);
 * const hash = await digest('SHA-1', binaryData);
 * console.log(hash);
 *
 * @example
 * // Hash large text content
 * const content = 'Lorem ipsum dolor sit amet...';
 * const hash = await digest('SHA-512', content);
 * console.log(hash.length); // 64 bytes for SHA-512
 */
async function digest(algorithm, data) {
  // Convert string data to Uint8Array using optimized approach
  const binaryData = typeof data === "string" 
    ? new TextEncoder().encode(data)
    : data;

  // Get the appropriate crypto implementation for current environment
  const crypto = getCrypto();

  // Use Web Crypto API in browser environment for better performance and security
  if (typeof window !== "undefined") {
    const hashBuffer = await crypto.subtle.digest(algorithm, binaryData);
    return new Uint8Array(hashBuffer);
  }

  // Use Node.js crypto module in server environment
  // Convert Web Crypto API algorithm names to Node.js format if needed
  const nodeAlgorithm = algorithm.toLowerCase().replace('-', '');
  const hash = crypto.createHash(nodeAlgorithm).update(binaryData).digest();
  
  // Ensure consistent Uint8Array return type across environments
  return new Uint8Array(hash);
}

// ------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------

/**
 * Verifies digital signatures using the Web Crypto API in a cross-platform manner.
 *
 * This function provides a unified interface for cryptographic signature verification
 * across different environments (browser and Node.js). It leverages the Web Crypto API's
 * subtle.verify method to perform secure signature validation using various cryptographic
 * algorithms including RSA-PSS, RSA-PKCS1-v1_5, ECDSA, and HMAC.
 *
 * The verification process involves comparing a provided signature against the expected
 * signature for given data using the specified public key and algorithm. This is essential
 * for ensuring data integrity and authenticity in cryptographic workflows.
 *
 * @param {Object|string} algorithm - Algorithm specification for signature verification:
 *                          - Object: Detailed parameters (e.g., { name: 'RSA-PSS', saltLength: 32 })
 *                          - String: Simple algorithm name (e.g., 'RSA-PSS', 'ECDSA')
 *                          Common algorithms:
 *                          - RSA-PSS: RSA with PSS padding
 *                          - RSA-PKCS1-v1_5: RSA with PKCS#1 v1.5 padding
 *                          - ECDSA: Elliptic Curve Digital Signature Algorithm
 *                          - HMAC: Hash-based Message Authentication Code
 *
 * @param {CryptoKey} key - The cryptographic key used for signature verification:
 *                          - For asymmetric algorithms: Must be a public key with 'verify' usage
 *                          - For symmetric algorithms (HMAC): Can be the same key used for signing
 *                          - Must be compatible with the specified algorithm
 *                          - Key must have been imported with 'verify' in keyUsages array
 *
 * @param {BufferSource|ArrayBuffer|Uint8Array} signature - The digital signature to verify:
 *                          - Binary signature data as BufferSource (ArrayBuffer, Uint8Array, etc.)
 *                          - Must be in the format produced by the corresponding sign operation
 *                          - Length and format depend on the algorithm used:
 *                            - RSA signatures: typically 256 bytes (2048-bit) or 512 bytes (4096-bit)
 *                            - ECDSA signatures: varies by curve (64 bytes for P-256, 96 bytes for P-384)
 *                            - HMAC signatures: depends on hash function (32 bytes for SHA-256)
 *
 * @param {BufferSource|ArrayBuffer|Uint8Array} data - The original data that was signed:
 *                          - Binary data as BufferSource that needs to be verified against signature
 *                          - Must be exactly the same data used during the signing process
 *                          - Any modification to this data will cause verification to fail
 *                          - For text data, ensure consistent encoding (typically UTF-8)
 *
 * @returns {Promise<boolean>} Promise resolving to verification result:
 *                          - true: Signature is valid and data integrity is confirmed
 *                          - false: Signature is invalid, data may have been tampered with
 *                          Note: This method never rejects for invalid signatures, only for
 *                          operational errors (invalid keys, unsupported algorithms, etc.)
 *
 * @throws {Error} Throws an error when:
 *                 - Crypto module is unavailable in the current environment
 *                 - Invalid algorithm specification or unsupported algorithm
 *                 - Key is inappropriate for the algorithm or missing 'verify' usage
 *                 - Signature or data parameters are malformed or incompatible
 *                 - Environment doesn't support the specified cryptographic operations
 *
 * @example
 * // Verify RSA-PSS signature
 * const publicKey = await importCryptoKey(/* RSA public key parameters *);
 * const signatureBytes = new Uint8Array([...]); // RSA signature
 * const originalData = new TextEncoder().encode('Hello, World!');
 * 
 * const isValid = await verifySignature(
 *   {
 *     name: 'RSA-PSS',
 *     saltLength: 32
 *   },
 *   publicKey,
 *   signatureBytes,
 *   originalData
 * );
 * console.log('Signature valid:', isValid);
 *
 * @example
 * // Verify ECDSA signature with P-256 curve
 * const ecdsaKey = await importCryptoKey(/* ECDSA public key parameters *);
 * const ecdsaSignature = new Uint8Array([...]); // ECDSA signature (64 bytes for P-256)
 * const messageData = new Uint8Array([...]); // Original message
 * 
 * const result = await verifySignature(
 *   { name: 'ECDSA', hash: 'SHA-256' },
 *   ecdsaKey,
 *   ecdsaSignature,
 *   messageData
 * );
 *
 * @example
 * // Verify HMAC signature (symmetric)
 * const hmacKey = await importCryptoKey(/* HMAC key parameters *);
 * const hmacSignature = new Uint8Array(32); // HMAC-SHA256 signature
 * const payload = new TextEncoder().encode('{"user": "john", "action": "login"}');
 * 
 * try {
 *   const verified = await verifySignature(
 *     { name: 'HMAC', hash: 'SHA-256' },
 *     hmacKey,
 *     hmacSignature,
 *     payload
 *   );
 *   if (verified) {
 *     console.log('Message authenticated successfully');
 *   } else {
 *     console.warn('Message authentication failed - possible tampering');
 *   }
 * } catch (error) {
 *   console.error('Verification error:', error.message);
 * }
 */
async function verifySignature(algorithm, key, signature, data) {
  // Retrieve the appropriate crypto module for the current environment
  const crypto = getCrypto();
  
  // Perform signature verification using the Web Crypto API
  // The subtle.verify method handles the cryptographic verification process
  // and returns a boolean indicating signature validity
  return await crypto.subtle.verify(algorithm, key, signature, data);
}

// Default export para compatibilidade
var index$3 = {
  getCrypto,
  setCrypto,
  decrypt,
  encrypt,
  decryptBuffer,
  encryptBuffer,
  digest,
  importCryptoKey,
  verifySignature,
};

declare const cryptoNamespace_decrypt: typeof decrypt;
declare const cryptoNamespace_decryptBuffer: typeof decryptBuffer;
declare const cryptoNamespace_digest: typeof digest;
declare const cryptoNamespace_encrypt: typeof encrypt;
declare const cryptoNamespace_encryptBuffer: typeof encryptBuffer;
declare const cryptoNamespace_getCrypto: typeof getCrypto;
declare const cryptoNamespace_importCryptoKey: typeof importCryptoKey;
declare const cryptoNamespace_setCrypto: typeof setCrypto;
declare const cryptoNamespace_verifySignature: typeof verifySignature;
declare namespace cryptoNamespace {
  export { cryptoNamespace_decrypt as decrypt, cryptoNamespace_decryptBuffer as decryptBuffer, index$3 as default, cryptoNamespace_digest as digest, cryptoNamespace_encrypt as encrypt, cryptoNamespace_encryptBuffer as encryptBuffer, cryptoNamespace_getCrypto as getCrypto, cryptoNamespace_importCryptoKey as importCryptoKey, cryptoNamespace_setCrypto as setCrypto, cryptoNamespace_verifySignature as verifySignature };
}

// ------------------------------------------------------------------------------------------------

/**
 * Converts an ECDSA signature from ASN.1/DER format to concatenated r|s format.
 * 
 * The function expects an ASN.1 SEQUENCE containing exactly two INTEGER elements (r and s).
 * Both r and s components are normalized to be multiples of 128 bits (16 bytes) by:
 * - Removing leading zero bytes used for two's complement padding
 * - Adding zero padding when components are 15 bytes (one byte short of 16-byte boundary)
 *
 * @param {Uint8Array} asn1Signature - The input signature in ASN.1/DER format
 * @returns {Uint8Array} The signature in concatenated r|s format where both r and s are 128-bit aligned
 * @throws {Error} If the input doesn't contain exactly 2 ASN.1 sequence elements
 * @throws {Error} If r or s components have unexpected lengths after normalization
 */
function convertECDSAASN1Signature(asn1Signature) {
  const elements = readASN1IntegerSequence(asn1Signature);
  
  if (elements.length !== 2) {
    throw new Error("Expected 2 ASN.1 sequence elements");
  }
  
  let [r, s] = elements;

  // Normalize r component to 128-bit boundary
  r = normalizeECDSAComponent(r);
  
  // Normalize s component to 128-bit boundary  
  s = normalizeECDSAComponent(s);

  // Concatenate normalized r and s components
  return bufferConcatenate(r, s);
}

// ------------------------------------------------------------------------------------------------

/**
 * Normalizes an ECDSA signature component (r or s) to be a multiple of 128 bits (16 bytes).
 * 
 * This function handles two cases:
 * 1. Removes leading zero byte if present for two's complement and length is 16n+1
 * 2. Adds leading zero byte padding if length is 16n-1 (15 bytes)
 *
 * @param {Uint8Array} component - The signature component to normalize
 * @returns {Uint8Array} The normalized component aligned to 128-bit boundary
 * @throws {Error} If the component length is not a multiple of 16 bytes after normalization
 */
function normalizeECDSAComponent(component) {
  const length = component.byteLength;
  let normalized = component;
  
  // Remove leading zero byte used for two's complement if length is 16n+1
  if (component[0] === 0 && length % 16 === 1) {
    normalized = component.slice(1);
  }
  // Add leading zero byte padding if length is 16n-1 (15 bytes)
  else if (length % 16 === 15) {
    const padding = new Uint8Array([0]);
    normalized = new Uint8Array(bufferConcatenate(padding, component));
  }

  // Validate that the component is now properly aligned to 128-bit boundary
  if (normalized.byteLength % 16 !== 0) {
    throw new Error("unknown ECDSA sig r length error");
  }

  return normalized;
}

// ------------------------------------------------------------------------------------------------

/**
 * Parses an ASN.1/DER encoded sequence and extracts all INTEGER elements.
 * 
 * This function performs basic ASN.1 parsing by:
 * 1. Validating the input starts with SEQUENCE tag (0x30)
 * 2. Reading the sequence length from the second byte
 * 3. Iterating through elements, ensuring each is an INTEGER (0x02)
 * 4. Extracting the value portion of each INTEGER element
 *
 * @param {Uint8Array} input - The ASN.1/DER encoded sequence
 * @returns {Array<Uint8Array>} Array of INTEGER values as Uint8Array buffers
 * @throws {Error} If input is not a valid ASN.1 SEQUENCE
 * @throws {Error} If any sequence element is not an ASN.1 INTEGER
 */
function readASN1IntegerSequence(input) {
  // Validate ASN.1 SEQUENCE tag
  if (input[0] !== 0x30) {
    throw new Error("Input is not an ASN.1 sequence");
  }

  // Extract sequence length from second byte
  const sequenceLength = input[1];
  const elements = [];
  
  // Get sequence content, skipping tag and length bytes
  let position = 2;
  const sequenceEnd = position + sequenceLength;

  // Parse all elements within the sequence
  while (position < sequenceEnd) {
    const tag = input[position];
    
    // Validate INTEGER tag
    if (tag !== 0x02) {
      throw new Error("Expected ASN.1 sequence element to be an INTEGER");
    }

    // Read element length
    const elementLength = input[position + 1];
    
    // Extract element value, skipping tag and length bytes
    const elementValue = input.slice(position + 2, position + 2 + elementLength);
    elements.push(elementValue);
    
    // Advance position to next element
    position += 2 + elementLength;
  }

  return elements;
}

// ------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------

/**
 * Extracts and processes data from a WebAuthn authentication assertion object.
 * 
 * This function parses the WebAuthn assertion response and extracts all relevant
 * authentication data including client data, authenticator data, signature, and
 * optional user handle information.
 *
 * @param {Object} assertion - The WebAuthn authentication assertion object
 * @param {string} assertion.id - The credential ID as a string
 * @param {ArrayBuffer} assertion.rawId - The credential ID as raw bytes
 * @param {string} assertion.type - The credential type (typically "public-key")
 * @param {Object} assertion.response - The authenticator assertion response
 * @param {ArrayBuffer} assertion.response.clientDataJSON - Client data in JSON format
 * @param {ArrayBuffer} assertion.response.authenticatorData - Authenticator data bytes
 * @param {ArrayBuffer} assertion.response.signature - The assertion signature
 * @param {ArrayBuffer} [assertion.response.userHandle] - Optional user handle
 * @returns {Object} Extracted authentication data with parsed components
 * @throws {Error} If extraction fails due to missing or invalid data
 */
function getAuthenticationAuthData(assertion) {
  const id = assertion.id;
  const rawId = base64FromBuffer(assertion.rawId);
  const type = assertion.type;

  // Build response object with all authentication data
  const response = {
    clientDataJSONDecoded: new TextDecoder().decode(assertion.response.clientDataJSON),
    clientDataJSON: base64FromBuffer(assertion.response.clientDataJSON),
    authenticatorData: base64FromBuffer(assertion.response.authenticatorData),
    signature: base64FromBuffer(assertion.response.signature),
    userHandle: assertion.response.userHandle
      ? base64FromBuffer(assertion.response.userHandle)
      : false
  };

  // Parse authenticator data structure
  const authData = getAuthDataFromAuthentication(assertion.response.authenticatorData);

  return {
    id,
    rawId,
    type,
    authData,
    response
  };
}

// ------------------------------------------------------------------------------------------------

/**
 * Parses WebAuthn authenticator data according to the FIDO2 specification.
 * 
 * The authenticator data structure contains:
 * - RP ID Hash (32 bytes): SHA-256 hash of the relying party identifier
 * - Flags (1 byte): Bit flags indicating various states
 * - Counter (4 bytes): Signature counter value (big-endian)
 * - Optional attested credential data (variable length)
 * - Optional extensions data (variable length)
 *
 * @param {ArrayBuffer} authData - Raw authenticator data from WebAuthn response
 * @returns {Object} Parsed authenticator data components
 * @throws {Error} If authenticator data is too short or contains invalid data
 */
function getAuthDataFromAuthentication(authData) {
  // Validate minimum length for RP ID hash, flags, and counter
  if (!authData || authData.byteLength < 37) {
    throw new Error(
      `Authenticator data was ${authData?.byteLength || "invalid"} bytes, expected at least 37 bytes`
    );
  }

  const dataView = new DataView(authData, authData.byteOffset, authData.length);
  let pointer = 0;

  // Extract RP ID hash (32 bytes)
  const rpIdHash = authData.slice(pointer, pointer + 32);
  pointer += 32;

  // Extract and parse flags byte
  const flagsBuf = authData.slice(pointer, pointer + 1);
  const flagsInt = new Uint8Array(flagsBuf)[0];
  pointer += 1;

  const flags = {
    up: !!(flagsInt & 0x01), // User Present (bit 0)
    uv: !!(flagsInt & 0x04), // User Verified (bit 2)
    be: !!(flagsInt & 0x08), // Backup Eligible (bit 3)
    bs: !!(flagsInt & 0x10), // Backup State (bit 4)
    at: !!(flagsInt & 0x40), // Attested Credential Data Present (bit 6)
    ed: !!(flagsInt & 0x80), // Extension Data Present (bit 7)
    flagsInt
  };

  // Extract signature counter (4 bytes, big-endian)
  const counterBuf = authData.slice(pointer, pointer + 4);
  const counter = dataView.getUint32(pointer, false); // false = big-endian
  pointer += 4;

  // Parse optional attested credential data
  const attestationResult = parseAttestedCredentialData(flags, authData, pointer);
  pointer = attestationResult.newPointer;

  // Parse optional extension data
  const extensionsData = parseExtensionData(flags, authData, pointer);

  return {
    rpIdHash: base64FromBuffer(rpIdHash),
    flagsBuf: base64FromBuffer(flagsBuf),
    flags,
    counter,
    counterBuf: base64FromBuffer(counterBuf),
    aaguid: attestationResult.aaguid,
    credentialId: base64FromBuffer(attestationResult.credentialId),
    credentialPublicKey: base64FromBuffer(attestationResult.credentialPublicKey),
    extensionsData
  };
}

// ------------------------------------------------------------------------------------------------

/**
 * Parses attested credential data from authenticator data when the AT flag is set.
 * 
 * Attested credential data structure:
 * - AAGUID (16 bytes): Authenticator attestation GUID
 * - Credential ID Length (2 bytes): Length of credential ID (big-endian)
 * - Credential ID (variable): The credential identifier
 * - Credential Public Key (variable): COSE-encoded public key
 *
 * @param {Object} flags - Parsed flags from authenticator data
 * @param {ArrayBuffer} authData - Complete authenticator data buffer
 * @param {number} pointer - Current parsing position in the buffer
 * @returns {Object} Parsed credential data and updated pointer position
 */
function parseAttestedCredentialData(flags, authData, pointer) {
  // Return undefined values if attested credential data is not present
  if (!flags.at) {
    return {
      aaguid: undefined,
      credentialId: undefined,
      credentialPublicKey: undefined,
      newPointer: pointer
    };
  }

  const dataView = new DataView(authData, authData.byteOffset, authData.length);

  // Extract AAGUID (16 bytes)
  const aaguid = authData.slice(pointer, pointer + 16);
  pointer += 16;

  // Extract credential ID length (2 bytes, big-endian)
  const credentialIdLength = dataView.getUint16(pointer, false);
  pointer += 2;

  // Extract credential ID
  const credentialId = authData.slice(pointer, pointer + credentialIdLength);
  pointer += credentialIdLength;

  // Extract credential public key (remaining data up to extensions)
  // Note: In practice, public key length varies, but for this implementation
  // we assume a fixed 77 bytes as per original code
  const credentialPublicKey = authData.slice(pointer, pointer + 77);
  pointer += 77;

  return {
    aaguid,
    credentialId,
    credentialPublicKey,
    newPointer: pointer
  };
}

// ------------------------------------------------------------------------------------------------

/**
 * Parses extension data from authenticator data when the ED flag is set.
 * 
 * Extension data is CBOR-encoded and contains additional authenticator
 * information. The data extends from the current pointer to the end of
 * the authenticator data buffer.
 *
 * @param {Object} flags - Parsed flags from authenticator data
 * @param {ArrayBuffer} authData - Complete authenticator data buffer
 * @param {number} pointer - Current parsing position in the buffer
 * @returns {ArrayBuffer|undefined} Extension data buffer or undefined if not present
 */
function parseExtensionData(flags, authData, pointer) {
  // Return undefined if extension data is not present
  if (!flags.ed) {
    return undefined;
  }

  // Extension data spans from current pointer to end of authenticator data
  return authData.slice(pointer);
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Módulo para processar e extrair dados de uma credencial de registro WebAuthn.
 */


// ------------------------------------------------------------------------------------------------

/**
 * Analisa o buffer de dados do autenticador (authData) para extrair o ID da credencial e a chave pública.
 * A estrutura do buffer `authData` é rigorosamente definida pela especificação WebAuthn.
 * Esta função decodifica essa estrutura de bytes.
 * @see https://www.w3.org/TR/webauthn-2/#sctn-authenticator-data
 *
 * @private
 * @param {ArrayBuffer} attestationObjectBuffer - O buffer do objeto de atestado, que contém os dados do autenticador.
 * @returns {{credentialId: string, publicKeyObject: string}} Um objeto contendo o ID da credencial e a chave pública, ambos codificados em Base64.
 */
function parseAuthenticatorData(attestationObjectBuffer) {
  // 1. Decodifica o objeto de atestado do formato CBOR para acessar seus campos internos.
  const attestationObject = decode(new Uint8Array(attestationObjectBuffer));
  const { authData } = attestationObject;

  // 2. Define constantes para os offsets e comprimentos dos campos na estrutura `authData`,
  // conforme a especificação. Isso substitui "números mágicos" por valores claros e documentados.
  const RP_ID_HASH_OFFSET = 0;
  const RP_ID_HASH_LENGTH = 32;
  const FLAGS_OFFSET = RP_ID_HASH_OFFSET + RP_ID_HASH_LENGTH; // 32
  const FLAGS_LENGTH = 1;
  const SIGN_COUNT_OFFSET = FLAGS_OFFSET + FLAGS_LENGTH; // 33
  const SIGN_COUNT_LENGTH = 4;

  // O `attestedCredentialData` é opcional e sua presença é indicada pelo bit 'AT' nas flags.
  // Seu início é após os campos de cabeçalho.
  const ATTESTED_CREDENTIAL_DATA_OFFSET = SIGN_COUNT_OFFSET + SIGN_COUNT_LENGTH; // 37
  const AAGUID_LENGTH = 16;
  const CREDENTIAL_ID_LENGTH_BYTES = 2;

  const CREDENTIAL_ID_LENGTH_OFFSET =
    ATTESTED_CREDENTIAL_DATA_OFFSET + AAGUID_LENGTH; // 53
  const CREDENTIAL_ID_OFFSET =
    CREDENTIAL_ID_LENGTH_OFFSET + CREDENTIAL_ID_LENGTH_BYTES; // 55

  // 3. Extrai o comprimento do ID da credencial. Este é um inteiro de 2 bytes (Big Endian).
  // Usamos um DataView para garantir a interpretação correta dos bytes.
  const idLenBytes = authData.slice(
    CREDENTIAL_ID_LENGTH_OFFSET,
    CREDENTIAL_ID_OFFSET
  );
  const dataView = new DataView(idLenBytes.buffer);
  const credentialIdLength = dataView.getUint16(0);

  // 4. Extrai o ID da credencial e a chave pública usando os comprimentos e offsets calculados.
  const credentialId = authData.slice(
    CREDENTIAL_ID_OFFSET,
    CREDENTIAL_ID_OFFSET + credentialIdLength
  );
  const publicKeyBytes = authData.slice(
    CREDENTIAL_ID_OFFSET + credentialIdLength
  );

  // 5. Retorna os dados extraídos, codificados em Base64 para facilitar o transporte e armazenamento.
  return {
    credentialId: base64FromBuffer(credentialId.buffer),
    publicKeyObject: base64FromBuffer(publicKeyBytes.buffer),
  };
}

// ------------------------------------------------------------------------------------------------

/**
 * Extrai e formata os dados de autenticação de registro de uma credencial WebAuthn (`PublicKeyCredential`).
 * A função processa os vários `ArrayBuffer`s da credencial, convertendo-os para formatos úteis (como Base64)
 * e decodificando a estrutura de dados interna do autenticador.
 *
 * @param {PublicKeyCredential} credential - O objeto de credencial WebAuthn retornado pelo navegador após um registro bem-sucedido.
 * @returns {object} Um objeto estruturado contendo os dados de registro prontos para serem enviados a um servidor.
 * @throws {Error} Lança um erro se ocorrer um problema durante o processamento da credencial (ex: formato inválido).
 */
function getRegistrationAuthData(credential) {
  const response = credential.response;

  // Analisa a estrutura de bytes do `attestationObject` para extrair dados internos.
  const parsedAuthData = parseAuthenticatorData(response.attestationObject);

  // Decodifica o `clientDataJSON` de ArrayBuffer para uma string UTF-8 legível.
  const clientDataJSONDecoded = new TextDecoder().decode(
    response.clientDataJSON
  );

  // Constrói o objeto de retorno final com todos os dados relevantes convertidos para Base64.
  // Isso prepara os dados para serem serializados (ex: como JSON) e enviados para o servidor.
  return {
    // Dados de nível superior da credencial
    rawId: base64FromBuffer(credential.rawId),
    id: credential.id,
    type: credential.type,
    authenticatorAttachment: credential.authenticatorAttachment,
    clientExtensionResults: credential.getClientExtensionResults(),

    // Dados extraídos e analisados do `authData`
    authData: parsedAuthData,

    // Dados da resposta do autenticador, convertidos para formatos apropriados
    response: {
      attestationObject: base64FromBuffer(response.attestationObject),
      authenticatorData: base64FromBuffer(response.getAuthenticatorData()),
      clientDataJSON: base64FromBuffer(response.clientDataJSON),
      clientDataJSONDecoded,
      transports: response.getTransports() || [],
      publicKey: base64FromBuffer(response.getPublicKey()),
      publicKeyAlgorithm: response.getPublicKeyAlgorithm(),
    },
  };
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Módulo para iniciar o processo de autenticação WebAuthn no navegador.
 */

// ------------------------------------------------------------------------------------------------

/**
 * Valida se o objeto de propriedades fornecido contém todos os campos necessários
 * para uma chamada `navigator.credentials.get()`. Lança um erro se a validação falhar.
 *
 * @private
 * @param {PublicKeyCredentialRequestOptions} props - O objeto de opções a ser validado.
 * @throws {Error} Lança um erro descritivo se um campo obrigatório estiver ausente ou for inválido.
 */
function validateAuthenticationOptions(props) {
  // Valida a presença do 'challenge', que é essencial para prevenir ataques de repetição.
  if (!props.challenge) {
    throw new Error("No challenge provided");
  }

  // Valida a lista de credenciais permitidas. O autenticador usará esta lista
  // para encontrar uma credencial correspondente que o usuário possa usar para assinar.
  if (
    !props.allowCredentials ||
    !Array.isArray(props.allowCredentials) ||
    props.allowCredentials.length === 0
  ) {
    throw new Error("No allowCredentials provided");
  }

  // Itera sobre cada credencial permitida para garantir que sua estrutura está correta.
  for (const cred of props.allowCredentials) {
    if (!cred.id) {
      throw new Error(
        "No allowCredentials (id) provided - The credential ID registered on the registration phase"
      );
    }
    if (!cred.type) {
      throw new Error("No allowCredentials (type) provided");
    }
  }
}

// ------------------------------------------------------------------------------------------------

/**
 * Inicia o processo de autenticação WebAuthn no navegador e retorna uma asserção de autenticação.
 * Esta função é um wrapper para `navigator.credentials.get()`, adicionando validações
 * e suporte a um callback opcional para retrocompatibilidade.
 *
 * @param {PublicKeyCredentialRequestOptions} props - O objeto contendo as opções para solicitar uma asserção de autenticação.
 * @param {Function} [callback] - Função de callback opcional que será chamada com a asserção obtida como argumento.
 * @returns {Promise<PublicKeyCredential|string>} Uma promessa que resolve para o objeto `PublicKeyCredential` (a asserção),
 * ou para a string "WebAuthn not supported" se a API não estiver disponível.
 * @throws {Error} Lança um erro se ocorrer um problema durante o processo de autenticação (ex: validação falha, usuário cancela).
 */
async function getWebAuthnAuthenticationAssertion(props, callback) {
  // 1. Verificação de Suporte da API
  // Garante que a API WebAuthn para obter credenciais está disponível no navegador.
  if (typeof navigator?.credentials?.get !== "function") {
    return "WebAuthn not supported";
  }

  // 2. Validação dos Parâmetros
  // Executa uma verificação rigorosa das opções para garantir que a chamada à API será bem-sucedida.
  validateAuthenticationOptions(props);

  // 3. Obtenção da Asserção
  // Invoca a API nativa do navegador para solicitar uma asserção de autenticação.
  // O `await` pausa a execução até que o usuário prove sua identidade ao autenticador.
  const assertion = await navigator.credentials.get({
    publicKey: props,
  });

  // 4. Execução do Callback (Opcional)
  // Se um callback válido for fornecido, ele é invocado com a asserção.
  if (typeof callback === "function") {
    return callback(assertion);
  }

  // 5. Retorno da Promessa
  // Se nenhum callback for usado, a função retorna a asserção, resolvendo a promessa.
  return assertion;
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Módulo para iniciar o processo de registro WebAuthn no navegador.
 */

// ------------------------------------------------------------------------------------------------
/**
 * Valida se o objeto de propriedades fornecido contém todos os campos necessários
 * para uma chamada `navigator.credentials.create()`. Lança um erro se a validação falhar.
 *
 * @private
 * @param {PublicKeyCredentialCreationOptions} props - O objeto de opções a ser validado.
 * @throws {Error} Lança um erro descritivo se um campo obrigatório estiver ausente ou for inválido.
 */
function validateCreationOptions(props) {
  // Valida a presença do 'challenge', que é essencial para a segurança do protocolo.
  if (!props.challenge) {
    throw new Error("No challenge provided");
  }

  // Valida as informações da Relying Party (RP).
  if (!props.rp) {
    throw new Error("No RP (Relying Party) provided");
  }
  if (!props.rp.name) {
    throw new Error("No RP (Relying Party) name provided");
  }

  // Valida as informações do usuário.
  if (!props.user) {
    throw new Error("No user provided");
  }
  if (!props.user.id) {
    throw new Error("No user id provided");
  }
  if (!props.user.displayName) {
    throw new Error("No user display name provided");
  }
  if (!props.user.name) {
    throw new Error("No user name provided");
  }

  // Valida os parâmetros dos tipos de credenciais de chave pública aceitos.
  // Deve ser um array não vazio.
  if (
    !props.pubKeyCredParams ||
    !Array.isArray(props.pubKeyCredParams) ||
    props.pubKeyCredParams.length === 0
  ) {
    throw new Error("No pubKeyCredParams provided");
  }

  // Itera sobre cada parâmetro para garantir que a estrutura está correta.
  for (const param of props.pubKeyCredParams) {
    if (!param.hasOwnProperty("alg")) {
      throw new Error("No pubKeyCredParams.alg provided");
    }
    if (!param.hasOwnProperty("type")) {
      throw new Error("No pubKeyCredParams.type provided");
    }
  }
}

// ------------------------------------------------------------------------------------------------
/**
 * Inicia o processo de registro WebAuthn no navegador e retorna uma nova credencial.
 * Esta função é um wrapper para `navigator.credentials.create()`, adicionando validações
 * e suporte a um callback opcional.
 *
 * @param {PublicKeyCredentialCreationOptions} [props={}] - O objeto contendo as opções para a criação de uma nova credencial de chave pública.
 * @param {Function} [callback] - Função de callback opcional que será chamada com a credencial criada como argumento.
 * @returns {Promise<PublicKeyCredential|string>} Uma promessa que resolve para o objeto `PublicKeyCredential` criado,
 * ou para a string "WebAuthn not supported" se a API não estiver disponível no navegador.
 * @throws {Error} Lança um erro se ocorrer um problema durante o processo de criação da credencial (ex: validação falha, cancelamento do usuário).
 */
async function getWebAuthnRegistrationCredential(props = {}, callback) {
  // 1. Verificação de Suporte da API
  // Garante que a API WebAuthn está disponível no objeto `navigator` antes de prosseguir.
  // Esta função destina-se apenas a ambientes de navegador.
  if (typeof navigator?.credentials?.create !== "function") {
    return "WebAuthn not supported";
  }

  // 2. Validação dos Parâmetros
  // Executa uma verificação rigorosa das opções fornecidas para garantir que a chamada à API
  // seja bem-sucedida e evitar erros inesperados.
  validateCreationOptions(props);

  // 3. Criação da Credencial
  // Invoca a API nativa do navegador para solicitar a criação de uma nova credencial.
  // O `await` pausa a execução até que o usuário interaja com o prompt (ex: usando biometria)
  // e a promessa seja resolvida ou rejeitada.
  const credential = await navigator.credentials.create({
    publicKey: props,
  });

  // 4. Execução do Callback (Opcional)
  // Se um callback foi fornecido e é uma função válida, ele é invocado com a credencial.
  // Este padrão é mantido para garantir a retrocompatibilidade com a assinatura original.
  if (typeof callback === "function") {
    return callback(credential);
  }

  // 5. Retorno da Promessa
  // Se nenhum callback for usado, a função retorna a credencial, resolvendo a promessa.
  return credential;
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Módulo para validação de RPID (Relying Party ID) usando dependências específicas.
 */


// ------------------------------------------------------------------------------------------------
/**
 * Valida de forma assíncrona que o RPID original corresponde ao RPID de verificação após a aplicação de um hash.
 * Esta função orquestra chamadas a utilitários criptográficos e de buffer para realizar a validação.
 *
 * @param {string} originalRPID - O identificador RPID original (string UTF-8) a ser validado.
 * @param {string} verifyRPID - A representação em Base64 do RPID a ser verificado. Espera-se que contenha o hash do RPID original.
 * @param {string} [algorithm="SHA-256"] - O algoritmo de hash a ser usado. Deve ser compatível com a implementação de `getCrypto`.
 * @returns {Promise<boolean>} Retorna uma promessa que resolve para `true` se os RPIDs corresponderem.
 * @throws {Error} Lança um erro se `originalRPID` ou `verifyRPID` não forem fornecidos, ou se os RPIDs não corresponderem.
 */
async function validateRPID(originalRPID, verifyRPID, algorithm = "SHA-256") {
  // 1. Validação dos Parâmetros de Entrada
  // Garante que os argumentos essenciais foram fornecidos antes de qualquer processamento.
  if (!originalRPID || typeof originalRPID !== "string") {
    throw new Error("originalRPID is required");
  }
  originalRPID = originalRPID.trim();
  if (!originalRPID) {
    throw new Error("originalRPID is required");
  }

  if (!verifyRPID || typeof verifyRPID !== "string") {
    throw new Error("verifyRPID is required");
  }

  verifyRPID = verifyRPID.trim();
  if (!verifyRPID) {
    throw new Error("verifyRPID is required");
  }

  // 2. Preparação para o Hashing
  // Obtém a interface de criptografia do ambiente (Node.js ou navegador) através do utilitário.
  const crypto = getCrypto();
  // Converte a string do RPID original em um formato de buffer, que é o tipo de entrada
  // esperado pela API de criptografia para a operação de digest.
  const originalRPIDBuffer = bufferFromString(originalRPID);

  // 3. Geração do Hash
  // Calcula o hash do buffer do RPID original usando o algoritmo especificado.
  // A operação `digest` é assíncrona e retorna o hash resultante (geralmente como um ArrayBuffer).
  const digestOfOriginalRPID = await crypto.subtle.digest(
    algorithm,
    originalRPIDBuffer
  );

  // 4. Decodificação e Extração do Hash de Verificação
  // Decodifica a string base64 `verifyRPID` para seu formato de buffer correspondente.
  const verifyRPIDBuffer = base64ToBuffer(verifyRPID);
  // Extrai os primeiros 32 bytes do buffer decodificado. Este segmento é assumido
  // como sendo o hash a ser comparado (consistente com o tamanho de um hash SHA-256).
  const digestToVerify = verifyRPIDBuffer.slice(0, 32);

  // 5. Comparação Segura
  // Compara o hash recém-gerado com o hash extraído do parâmetro de verificação.
  // É crucial que `bufferCompare` implemente uma comparação segura contra ataques de temporização.
  const areDigestsEqual = bufferCompare(digestOfOriginalRPID, digestToVerify);

  if (!areDigestsEqual) {
    // Se a comparação falhar, lança um erro específico para indicar a incompatibilidade.
    throw new Error(
      `Registration RPID does not match the authentication RPID.`
    );
  }

  // Se a comparação for bem-sucedida, a validação está completa.
  return true;
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Módulo otimizado para validação de asserção de autenticação WebAuthn.
 */


// ------------------------------------------------------------------------------------------------
/**
 * Recupera os parâmetros do algoritmo para importar uma chave pública com base no identificador do algoritmo.
 * @private
 */
function getImportPublicKeyAlgorithm(publicKeyAlgorithm) {
  switch (publicKeyAlgorithm) {
    case -7: // ES256
      return { name: "ECDSA", namedCurve: "P-256" };
    case -257: // RS256
      return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
    case -8: // Ed25519
      throw new Error("Ed25519 is not supported by crypto.subtle directly");
    default:
      throw new Error(`Unsupported algorithm: ${publicKeyAlgorithm}`);
  }
}

/**
 * Recupera os parâmetros do algoritmo para verificar uma assinatura com base no identificador do algoritmo.
 * @private
 */
function getAlgorithmVerifySignatureParam(publicKeyAlgorithm) {
  switch (publicKeyAlgorithm) {
    case -7: // ES256
      return { name: "ECDSA", hash: { name: "SHA-256" } };
    case -257: // RS256
      return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
    case -8: // Ed25519
      throw new Error(
        "Ed25519 is not supported by crypto.subtle. Use an external library."
      );
    default:
      throw new Error(`Unsupported algorithm: ${publicKeyAlgorithm}`);
  }
}

/**
 * Gera um hash combinado a partir dos dados do autenticador e do clientDataJSON da asserção.
 * Este é o payload que foi originalmente assinado pelo autenticador.
 * @private
 */
async function generateDataToVerify(assertion) {
  const authenticatorDataBuffer = base64ToBuffer(
    assertion.response.authenticatorData
  );
  const clientDataJSONBuffer = base64ToBuffer(assertion.response.clientDataJSON);
  const clientDataJSONHash = await crypto.subtle.digest(
    "SHA-256",
    clientDataJSONBuffer
  );

  return bufferConcatenate(authenticatorDataBuffer, clientDataJSONHash);
}

// ------------------------------------------------------------------------------------------------
/**
 * Valida de forma assíncrona uma asserção de autenticação WebAuthn em um fluxo otimizado.
 *
 * @param {object} credential - O objeto da credencial armazenado, contendo a chave pública.
 * @param {object} assertion - A asserção de autenticação recebida do cliente.
 * @param {object} [expectedProps={}] - Propriedades esperadas para validação (challenge, origin, etc.).
 * @param {object} [incomingProps={}] - Propriedades recebidas na requisição (contador da asserção).
 * @param {object} [publicKeyProps={}] - Opções para a importação da chave pública.
 * @param {boolean} [convertECDSignature=true] - Se deve converter a assinatura ECDSA do formato bruto para ASN.1.
 * @returns {Promise<boolean>} Retorna `true` se a validação for bem-sucedida.
 * @throws {Error} Lança um erro detalhado na primeira falha de validação.
 */
async function validateAuthentication(
  credential,
  assertion,
  expectedProps = {},
  incomingProps = {},
  publicKeyProps = {},
  convertECDSignature = true
) {
  // ## 1. Validação Estrutural dos Objetos
  if (!credential) {
    throw new Error("Missing credential");
  }
  if (!credential.id) {
    throw new Error("Missing credential ID");
  }
  if (!credential.rawId) {
    throw new Error("Missing credential rawId");
  }
  if (credential.type !== "public-key") {
    throw new Error("Credential type must be 'public-key'");
  }

  if (!assertion) {
    throw new Error("Missing assertion");
  }
  if (!assertion.id) {
    throw new Error("Missing assertion ID");
  }
  if (!assertion.rawId) {
    throw new Error("Missing assertion rawId");
  }
  if (assertion.type !== "public-key") {
    throw new Error("Assertion type must be 'public-key'");
  }

  // ## 2. Validação de Consistência entre Credencial e Asserção
  if (credential.id !== assertion.id) {
    throw new Error("Credential ID does not match assertion ID");
  }
  if (credential.rawId !== assertion.rawId) {
    throw new Error("Credential rawId does not match assertion rawId");
  }

  // ## 3. Validação do Contador de Assinatura (Prevenção de Replay/Clonagem)
  const { counterCredential } = expectedProps;
  const { counterAssertion } = incomingProps;
  if (!isNumber(counterCredential) || counterCredential < 0) {
    throw new Error("counterCredential must be a number >= 0");
  }
  if (!isNumber(counterAssertion) || counterAssertion < 0) {
    throw new Error("counterAssertion must be a number >= 0");
  }
  // A especificação WebAuthn exige que o contador da nova asserção seja maior que o contador armazenado.
  // Isso previne ataques de repetição e detecta clonagem de autenticadores.
  // Uma exceção é quando um autenticador não suporta contadores e sempre retorna 0.
  // A lógica abaixo acomoda este cenário: a verificação só é imposta se o novo contador for diferente de zero.
  if (counterAssertion !== 0) {
    if (counterAssertion <= counterCredential) {
      throw new Error(
        `Invalid signature counter. The assertion counter (${counterAssertion}) must be strictly greater than the stored credential counter (${counterCredential}).`
      );
    }
  }

  // ## 4. Validação dos Parâmetros da Requisição (Client Data)
  const clientDataJSON = JSON.parse(assertion.response.clientDataJSONDecoded);
  const assertionChallenge = base64From(clientDataJSON?.challenge || "");
  if (expectedProps.challenge !== assertionChallenge) {
    throw new Error("Challenge provided does not match assertion challenge.");
  }
  if (expectedProps.origin !== clientDataJSON?.origin) {
    throw new Error(
      `Origin does not match. Expected: ${expectedProps.origin} Actual: ${
        clientDataJSON?.origin ?? "none"
      }`
    );
  }
  if (expectedProps.type !== clientDataJSON?.type) {
    throw new Error(
      `Type does not match. Expected: ${expectedProps.type} Actual: ${
        clientDataJSON?.type ?? "none"
      }`
    );
  }

  // ## 5. Validação das Flags do Autenticador
  if (!assertion.authData.flags.up) {
    throw new Error("User Present flag (up) is required for authentication.");
  }
  if (!assertion.authData.flags.uv) {
    throw new Error("User Verified flag (uv) is required for authentication.");
  }

  // ## 6. Validação do RP ID
  await validateRPID(expectedProps.rpID, assertion.authData.rpIdHash);

  // ## 7. Verificação da Assinatura Criptográfica
  const importAlgo = getImportPublicKeyAlgorithm(
    credential.response.publicKeyAlgorithm
  );
  const verifyAlgo = getAlgorithmVerifySignatureParam(
    credential.response.publicKeyAlgorithm
  );

  const publicKey = await importCryptoKey(
    publicKeyProps?.importKey?.format || "spki",
    base64ToBuffer(credential.response.publicKey),
    importAlgo,
    publicKeyProps?.importKey?.extractable || false,
    ["verify"]
  );

  let signature = new Uint8Array(base64ToBuffer(assertion.response.signature));
  // Assinaturas ECDSA de autenticadores vêm em formato bruto (r||s), mas a Web Crypto API espera ASN.1.
  if (convertECDSignature && credential.response.publicKeyAlgorithm === -7) {
    signature = convertECDSAASN1Signature(signature);
  }

  const dataToVerify = await generateDataToVerify(assertion);

  return verifySignature(verifyAlgo, publicKey, signature, dataToVerify);
}

// ------------------------------------------------------------------------------------------------

/**
 * @file Módulo otimizado para validação de credencial de registro WebAuthn.
 */


// ------------------------------------------------------------------------------------------------

/**
 * Valida uma credencial de registro WebAuthn de forma eficiente.
 *
 * Esta função executa uma série de validações em um fluxo único e otimizado:
 * 1. Valida a estrutura e as propriedades essenciais da credencial.
 * 2. Valida os parâmetros da requisição (challenge, origin, type) contra os valores esperados.
 * 3. Decodifica e valida o formato e a declaração do objeto de atestado.
 *
 * @param {object} credential - A credencial WebAuthn a ser validada.
 * @param {object} [expectedProps={}] - Um objeto contendo as propriedades esperadas para a validação.
 * @param {string} [expectedProps.challenge] - O challenge esperado, conforme enviado ao cliente.
 * @param {string} [expectedProps.origin] - A origem (domínio) esperada da requisição.
 * @param {string} [expectedProps.type] - O tipo de operação esperado (ex: 'webauthn.create').
 * @returns {true} Retorna `true` se a credencial for válida em todos os aspectos.
 * @throws {Error} Lança um erro descritivo no primeiro ponto em que a validação falhar.
 */
function validateRegistration(credential, expectedProps = {}) {
  // ## 1. Validação Estrutural da Credencial
  // Garante que o objeto da credencial e suas propriedades fundamentais existem e são do tipo correto.
  if (!credential) {
    throw new Error("Missing credential");
  }
  if (!credential.id) {
    throw new Error("Missing credential ID");
  }
  if (!credential.rawId) {
    throw new Error("Missing credential rawId");
  }
  if (!credential.type || credential.type !== "public-key") {
    throw new Error(
      "Missing credential type or credential type is not public-key"
    );
  }

  // ## 2. Validação dos Parâmetros da Requisição (Client Data)
  // Compara os dados da requisição (challenge, origin, type) com os valores esperados.
  const clientDataJSON = JSON.parse(credential.response.clientDataJSONDecoded);

  if (expectedProps.challenge !== clientDataJSON?.challenge) {
    throw new Error(
      `Challenge does not match. Provided challenge: ${
        clientDataJSON?.challenge ?? "none"
      }.`
    );
  }

  if (expectedProps.origin !== clientDataJSON?.origin) {
    throw new Error(
      `Origin does not match. Expected: ${expectedProps.origin} Actual: ${
        clientDataJSON?.origin ?? "none"
      }`
    );
  }

  if (expectedProps.type !== clientDataJSON?.type) {
    throw new Error(
      `Type does not match. Expected: ${expectedProps.type} Actual: ${
        clientDataJSON?.type ?? "none"
      }`
    );
  }

  // ## 3. Validação do Objeto de Atestado (Attestation Object)
  // Decodifica e valida o formato e a declaração de atestado.
  const attestationObjectBuffer = base64ToBuffer(
    credential.response.attestationObject
  );
  // A biblioteca `cbor.decode` é altamente otimizada para essa operação.
  const attestationObject = decode(new Uint8Array(attestationObjectBuffer));

  if (!attestationObject.fmt) {
    throw new Error("Missing attestation object format");
  }

  // Para o formato 'none', a declaração de atestado (attStmt) deve estar vazia.
  // A biblioteca cbor-x decodifica mapas CBOR em objetos Map do JS, que possuem a propriedade `.size`.
  if (attestationObject.fmt === "none") {
    if (attestationObject.attStmt && attestationObject.attStmt.size > 0) {
      throw new Error("None attestation had unexpected attestation statement");
    }
  } else {
    // Atualmente, apenas o formato 'none' é suportado por esta validação.
    throw new Error(`Unsupported Attestation Format: ${attestationObject.fmt}`);
  }

  // Se todas as validações passarem, a função retorna `true`.
  return true;
}

// ------------------------------------------------------------------------------------------------

// Default export para compatibilidade
var index$2 = {
  convertECDSAASN1Signature,
  getAuthenticationAuthData,
  getRegistrationAuthData,
  getWebAuthnAuthenticationAssertion,
  getWebAuthnRegistrationCredential,
  validateRPID,
  validateAuthentication,
  validateRegistration,
};

declare const authNamespace_convertECDSAASN1Signature: typeof convertECDSAASN1Signature;
declare const authNamespace_getAuthenticationAuthData: typeof getAuthenticationAuthData;
declare const authNamespace_getRegistrationAuthData: typeof getRegistrationAuthData;
declare const authNamespace_getWebAuthnAuthenticationAssertion: typeof getWebAuthnAuthenticationAssertion;
declare const authNamespace_getWebAuthnRegistrationCredential: typeof getWebAuthnRegistrationCredential;
declare const authNamespace_validateAuthentication: typeof validateAuthentication;
declare const authNamespace_validateRPID: typeof validateRPID;
declare const authNamespace_validateRegistration: typeof validateRegistration;
declare namespace authNamespace {
  export { authNamespace_convertECDSAASN1Signature as convertECDSAASN1Signature, index$2 as default, authNamespace_getAuthenticationAuthData as getAuthenticationAuthData, authNamespace_getRegistrationAuthData as getRegistrationAuthData, authNamespace_getWebAuthnAuthenticationAssertion as getWebAuthnAuthenticationAssertion, authNamespace_getWebAuthnRegistrationCredential as getWebAuthnRegistrationCredential, authNamespace_validateAuthentication as validateAuthentication, authNamespace_validateRPID as validateRPID, authNamespace_validateRegistration as validateRegistration };
}

/**
 * @fileoverview Utilitário para formatar condições de busca por intervalo de datas
 * em objetos de consulta, com dependências de conversão e ajuste de data/hora.
 */


// ------------------------------------------------------------------------------------------------

/**
 * Cria uma condição de busca por intervalo de datas (BETWEEN) em um objeto.
 *
 * @summary Formata um intervalo de datas para uma condição de ORM.
 * @description Esta função modifica um objeto de consulta, convertendo strings de data em
 * objetos `Date` e criando uma cláusula `$and` com condições `$gte` (maior ou igual a)
 * e/ou `$lte` (menor ou igual a).
 *
 * **Efeitos Colaterais:**
 * 1.  Adiciona uma nova chave (`key`) ao objeto com a condição de intervalo.
 * 2.  **Remove** as chaves originais de data (`afterKey`, `beforeKey`) do objeto.
 *
 * @param {object} object - O objeto de consulta que será **modificado**.
 * @param {string} [fromFormat=DATE_BR_FORMAT_D] - O formato em que as strings de data de entrada estão.
 * @param {string} [key="created_at"] - A chave principal no objeto onde a condição `$and` será criada.
 * @param {string} [beforeKey="created_at_until"] - A chave que contém a data final do intervalo (`<=`).
 * @param {string} [afterKey="created_at_from"] - A chave que contém a data inicial do intervalo (`>=`).
 * @param {boolean} [resetHMS=true] - Se `true`, ajusta a data inicial para o primeiro momento do dia (00:00:00) e a data final para o último (23:59:59).
 * @returns {object|null} Retorna o objeto modificado se alguma condição for aplicada, ou `null` se nenhuma for.
 *
 * @example
 * // Filtro de entrada
 * const filter = { created_at_from: '01-08-2025', created_at_until: '18-08-2025' };
 *
 * setConditionBetweenDates(filter);
 *
 * // O objeto 'filter' é modificado para:
 * // {
 * //   created_at: {
 * //     $and: [
 * //       { $gte: new Date('2025-08-01T00:00:00.000') },
 * //       { $lte: new Date('2025-08-18T23:59:59.999') }
 * //     ]
 * //   }
 * // }
 * // Note que 'created_at_from' e 'created_at_until' foram removidos.
 */
function setConditionBetweenDates(
  object,
  fromFormat = DATE_BR_FORMAT_D,
  key = "created_at",
  beforeKey = "created_at_until",
  afterKey = "created_at_from",
  resetHMS = true
) {
  // Guarda de validação: retorna null se o objeto não existir ou se nenhuma das chaves de
  // intervalo de data estiver presente, mantendo o comportamento original.
  if (!object || (!object[afterKey] && !object[beforeKey])) {
    return null;
  }

  const conditions = [];

  // Processa a data inicial do intervalo ('de')
  if (object[afterKey]) {
    // Converte a string de data para um objeto Date.
    const fromDate = stringToDate(object[afterKey], fromFormat);

    // Ajusta a data para o início do dia, se solicitado.
    const finalDate = resetHMS ? dateFirstHourOfDay(fromDate) : fromDate;

    conditions.push({ $gte: finalDate });

    // Remove a chave original do objeto, conforme a lógica original.
    delete object[afterKey];
  }

  // Processa a data final do intervalo ('até')
  if (object[beforeKey]) {
    const untilDate = stringToDate(object[beforeKey], fromFormat);

    // Ajusta a data para o final do dia, se solicitado.
    const finalDate = resetHMS ? dateLastHourOfDay(untilDate) : untilDate;

    conditions.push({ $lte: finalDate });

    // Remove a chave original do objeto.
    delete object[beforeKey];
  }

  // Adiciona a nova chave de condição ao objeto.
  object[key] = {
    $and: conditions,
  };

  // Retorna o objeto modificado, mantendo o comportamento original.
  return object;
}
// ------------------------------------------------------------------------------------------------

/**
 * @fileoverview Fornece uma função utilitária para formatar condições de busca
 * por intervalo (BETWEEN) em objetos de consulta de banco de dados.
 */

/**
 * Cria uma condição de busca por intervalo (BETWEEN) em um objeto de consulta.
 *
 * @summary Formata um valor de objeto para uma condição de intervalo (BETWEEN) de ORM.
 * @description Modifica um objeto de consulta para adicionar uma cláusula `$and` com condições
 * `$gte` (maior ou igual a) e/ou `$lte` (menor ou igual a). Esta função é útil para filtrar
 * por um intervalo de valores (ex: datas, preços). **A função modifica o objeto de entrada diretamente**.
 *
 * @param {object} object - O objeto de consulta que será **modificado**.
 * @param {string} [key="value"] - A chave principal no objeto onde a condição `$and` será criada.
 * @param {string} [beforeKey="value_until"] - A chave no objeto que contém o valor final do intervalo (`<=`).
 * @param {string} [afterKey="value_from"] - A chave no objeto que contém o valor inicial do intervalo (`>=`).
 * @returns {object|void} Retorna o objeto modificado se ao menos uma condição (`beforeKey` ou `afterKey`)
 * for aplicada. Retorna `undefined` (implicitamente) se nenhuma condição for encontrada no objeto.
 * @example
 * // Caso com ambas as chaves
 * const query = { value_from: '2025-01-01', value_until: '2025-01-31' };
 * setConditionBetweenValues(query);
 * // query é modificado para:
 * // {
 * //   value_from: '2025-01-01',
 * //   value_until: '2025-01-31',
 * //   value: { $and: [ { $gte: '2025-01-01' }, { $lte: '2025-01-31' } ] }
 * // }
 *
 * // Caso com apenas a chave inicial
 * const query2 = { value_from: 100 };
 * setConditionBetweenValues(query2);
 * // query2 é modificado para: { value_from: 100, value: { $and: [ { $gte: 100 } ] } }
 */
function setConditionBetweenValues(
  object,
  key = "value",
  beforeKey = "value_until",
  afterKey = "value_from"
) {
  // Guarda de validação: se o objeto não existe, ou se nenhuma das chaves de
  // intervalo (`afterKey` ou `beforeKey`) está presente, a função não faz nada.
  // Preserva o retorno implícito de `undefined` do código original.
  if (!object || (!object[afterKey] && !object[beforeKey])) {
    return;
  }

  const conditions = [];

  // Adiciona a condição de limite inferior se a chave correspondente existir.
  if (object[afterKey]) {
    conditions.push({ $gte: object[afterKey] });
  }

  // Adiciona a condição de limite superior se a chave correspondente existir.
  if (object[beforeKey]) {
    conditions.push({ $lte: object[beforeKey] });
  }

  // Atribui a nova estrutura de condição ao objeto na chave especificada.
  object[key] = {
    $and: conditions,
  };

  // Preserva o retorno do objeto modificado do código original.
  return object;
}
// ------------------------------------------------------------------------------------------------

/**
 * @fileoverview Fornece uma função utilitária para formatar condições de busca
 * textual (LIKE) em objetos de consulta de banco de dados.
 */

/**
 * Modifica um objeto para criar uma condição de busca textual (LIKE/ILIKE).
 *
 * @summary Formata um valor de objeto para uma condição LIKE de ORM.
 * @description Esta função é um utilitário para construir cláusulas de consulta para ORMs (como Sequelize).
 * Ela pega o valor de uma chave no objeto, o envolve com wildcards (`%`) e o reatribui
 * à mesma chave no formato `{ $iLike: '%valor%' }` ou `{ $like: '%valor%' }`.
 * A função modifica o objeto de entrada diretamente (mutação).
 *
 * @param {object} object - O objeto de consulta que será **modificado**.
 * @param {string} key - A chave no objeto cujo valor será formatado.
 * @param {boolean} [insensitive=true] - Se `true`, usa `$iLike` (case-insensitive). Se `false`, usa `$like` (case-sensitive).
 * @returns {void} Esta função não retorna um valor; ela modifica o objeto passado como referência.
 * @example
 * const query = { name: 'Maria' };
 * setConditionStringLike(query, 'name');
 * // O objeto 'query' agora é: { name: { $iLike: '%Maria%' } }
 *
 * const filter = { email: 'TESTE@' };
 * setConditionStringLike(filter, 'email', false);
 * // O objeto 'filter' agora é: { email: { $like: '%TESTE@%' } }
 *
 * const emptyQuery = { name: '' };
 * setConditionStringLike(emptyQuery, 'name');
 * // O objeto 'emptyQuery' não é modificado, pois o valor inicial é "falsy".
 */
function setConditionStringLike(object, key, insensitive = true) {
  // Guarda de validação: se o objeto, a chave ou o valor na chave não existirem
  // ou forem "falsy" (como uma string vazia), a função não faz nada.
  if (!object || !key || !object[key]) {
    return;
  }

  // Determina o operador a ser usado com base na opção 'insensitive'.
  const operator = insensitive ? '$iLike' : '$like';
  
  // Armazena o valor original para evitar problemas na reatribuição.
  const value = object[key];

  // Modifica o objeto, reatribuindo a chave com a nova estrutura de condição.
  // Usa a sintaxe de nome de propriedade computada ([operator]) para definir a chave dinamicamente.
  object[key] = {
    [operator]: `%${value}%`,
  };
}
// ------------------------------------------------------------------------------------------------

// Default export para compatibilidade
var index$1 = {
  setConditionBetweenDates,
  setConditionBetweenValues,
  setConditionStringLike,
};

declare const db_setConditionBetweenDates: typeof setConditionBetweenDates;
declare const db_setConditionBetweenValues: typeof setConditionBetweenValues;
declare const db_setConditionStringLike: typeof setConditionStringLike;
declare namespace db {
  export { index$1 as default, db_setConditionBetweenDates as setConditionBetweenDates, db_setConditionBetweenValues as setConditionBetweenValues, db_setConditionStringLike as setConditionStringLike };
}

// =================================================================================================
// ARQUIVO:      BulkProcessor.js
// OBJETIVO:     Fornecer uma classe genérica e de alta performance para processamento de dados
//               em lote (bulk). Abstrai a complexidade de acumular itens, enviá-los em
//               batches, e gerenciar concorrência e finalização segura.
// =================================================================================================

/**
 * @typedef {object} Logger
 * @description Define a interface para um logger compatível.
 * @property {(message: string, context?: object) => void} info - Função para logar mensagens informativas.
 * @property {(message: string, context?: object) => void} error - Função para logar mensagens de erro.
 */

/**
 * @typedef {object} BulkProcessorOptions
 * @property {number} [limit=1000] - O número de itens a acumular antes de disparar o processamento do lote. Será forçado para no mínimo 1.
 * @property {Logger} [logger] - Uma instância de logger estruturado. Se não for fornecido, um logger silencioso será usado.
 * @property {any} [payload={}] - Um objeto de dados estático que será passado para todos os callbacks.
 * @property {any} [serviceContext=null] - Um contexto de serviço ou de dados que será passado para os callbacks.
 * @property {(params: { batch: any[], payload: any, serviceContext: any, logger: Logger }) => Promise<void>} [onFlush] - Callback assíncrono chamado para processar um lote.
 * @property {(params: { buffer: any[], payload: any, item: any, serviceContext: any, logger: Logger }) => Promise<void>} [onAdd] - Callback assíncrono chamado a cada item adicionado.
 * @property {(params: { payload: any, serviceContext: any, logger: Logger }) => Promise<void>} [onEnd] - Callback assíncrono chamado quando o método `end()` é invocado, antes do flush final.
 */

/**
 * @class BulkProcessor
 * @description Gerencia o processamento de itens em lote (bulk).
 * A classe acumula itens em um buffer interno e invoca um callback de processamento
 * assíncrono quando o tamanho do lote atinge um limite definido. É ideal para otimizar
 * operações de I/O, como inserções em banco de dados ou chamadas para APIs.
 *
 * @example
 * // Uso padrão com a nova API de opções
 * const processor = new BulkProcessor({
 * limit: 100,
 * onFlush: async ({ batch }) => {
 * console.log(`Processing ${batch.length} items.`);
 * // ...lógica de inserção no banco de dados...
 * }
 * });
 *
 * for (let i = 0; i < 1000; i++) {
 * processor.add({ id: i, data: `item-${i}` });
 * }
 * await processor.end();
 */
class BulkProcessor {
  /** @private @type {any[]} */
  #buffer = [];
  /** @private @type {number} */
  #limit;
  /** @private @type {number} */
  #maxBufferSize;
  /** @private @type {number} */
  #maxConcurrentFlushes;
  /** @private @type {number} */
  #activeFlushes = 0;
  /** @private @type {boolean} */
  #isEnding = false;
  /** @private @type {Logger} */
  #logger;
  /** @private @type {any} */
  #payload;
  /** @private @type {any} */
  #serviceContext;
  /** @private @type {number} */
  #retries;
  /** @private @type {number} */
  #retryDelayMs;
  /** @private @type {number} */
  #flushTimeoutMs;
  /** @private @type {{onAdd?: Function, onFlush?: Function, onEnd?: Function, onBackpressure?: Function, onFlushFailure?: Function, onFinished?: Function}} */
  #callbacks;

  /**
   * Constrói e configura uma nova instância do BulkProcessor.
   * Este método é projetado para ser flexível, suportando tanto uma assinatura
   * moderna baseada em um único objeto de opções quanto uma assinatura legada
   * para garantir a retrocompatibilidade.
   *
   * @param {BulkProcessorOptions | object} [arg1={}] - O objeto de opções ou o `payload` (legado).
   * @param {object} [arg2={}] - O objeto `callbackFunctions` (legado).
   * @param {object} [arg3={}] - O objeto `options` (legado).
   */
  constructor(arg1 = {}, arg2 = {}, arg3 = {}) {
    let options;

    // Bloco de compatibilidade para a assinatura legada (payload, callbacks, options).
    // Se os argumentos 2 ou 3 forem fornecidos, o construtor assume que a assinatura
    // antiga está em uso e remapeia os parâmetros para o novo formato de 'options'.
    if (Object.keys(arg2).length > 0 || Object.keys(arg3).length > 0) {
      const payload = arg1;
      const callbackFunctions = arg2;
      const otherOptions = arg3;
      options = {
        ...otherOptions,
        payload: otherOptions.payload || payload,
        onAdd: otherOptions.onAdd || callbackFunctions.onAddCallback,
        onFlush: otherOptions.onFlush || callbackFunctions.onFlushCallback,
        onEnd: otherOptions.onEnd || callbackFunctions.onEndCallback,
        onFinished:
          otherOptions.onFinished || callbackFunctions.onFinishedCallback,
      };
    } else {
      options = arg1;
    }

    // Define os padrões para todas as configurações e extrai os valores fornecidos pelo usuário.
    const {
      limit: userLimit = 1000,
      maxBufferSize,
      maxConcurrentFlushes = 3,
      flushTimeoutMs = 30000,
      retries = 0,
      retryDelayMs = 1000,
      logger = {
        info: () => {},
        error: () => {},
        warn: () => {},
        debug: () => {},
      },
      payload = {},
      serviceContext = null,
      onFlush,
      onAdd,
      onEnd,
      onBackpressure,
      onFlushFailure,
      onFinished,
    } = options;

    // --- Sanitização e Validação dos Parâmetros ---
    // Esta seção "blinda" o processador contra configurações inválidas ou inseguras,
    // garantindo que os valores numéricos sejam válidos e estejam dentro de limites razoáveis.
    this.#limit = Math.max(defaultNumeric(userLimit, 1), 1);
    // O buffer deve ter espaço para pelo menos dois lotes completos para evitar backpressure prematuro.
    this.#maxBufferSize = Math.max(
      this.#limit * 2,
      defaultNumeric(maxBufferSize, 0)
    );
    // Deve haver pelo menos 1 slot de processamento concorrente (comportamento sequencial).
    this.#maxConcurrentFlushes = Math.max(
      1,
      defaultNumeric(maxConcurrentFlushes, 3)
    );
    // O número de retries não pode ser negativo.
    this.#retries = Math.max(0, defaultNumeric(retries, 0));
    // Garante um delay mínimo para evitar loops de retry muito agressivos.
    this.#retryDelayMs = Math.max(100, defaultNumeric(retryDelayMs, 1000));
    // Garante um timeout mínimo para o flush.
    this.#flushTimeoutMs = Math.max(500, defaultNumeric(flushTimeoutMs, 30000));

    // Atribuição das propriedades da instância.
    this.#logger = logger;
    this.#payload = payload;
    this.#serviceContext = serviceContext;
    this.#callbacks = {
      onFlush,
      onAdd,
      onEnd,
      onBackpressure,
      onFlushFailure,
      onFinished,
    };

    // Log de inicialização para observabilidade, registrando a configuração final aplicada.
    this.#logger.info(`BulkProcessor inicializado.`, {
      limit: this.#limit,
      maxBufferSize: this.#maxBufferSize,
      maxConcurrentFlushes: this.#maxConcurrentFlushes,
      retries: this.#retries,
      retryDelayMs: this.#retryDelayMs,
      flushTimeoutMs: this.#flushTimeoutMs,
    });
  }

  /**
   * Adiciona um item à fila de processamento de forma assíncrona.
   *
   * Este é o principal método para popular o processador. Ele gerencia a lógica de backpressure:
   * se o buffer interno atingir sua capacidade máxima (`maxBufferSize`), a execução
   * deste método será pausada até que haja espaço disponível. Isso previne o consumo
   * excessivo de memória sob alta carga.
   *
   * A chamada ao callback `onAdd` é realizada de forma "fire-and-forget" e não bloqueia a adição do item.
   *
   * @param {*} item - O item a ser adicionado ao lote.
   * @returns {Promise<void>} Uma promessa que resolve quando o item foi adicionado com sucesso ao buffer.
   */
  async add(item) {
    // Trava de segurança para impedir a adição de itens durante o processo de finalização.
    if (this.#isEnding) {
      this.#logger.info(
        "Processador em estado de finalização. Novos itens estão sendo ignorados.",
        { item }
      );
      return;
    }

    // --- Lógica de Backpressure ---
    // Se o buffer atingiu a capacidade máxima, o processador entra em estado de espera.
    if (this.#buffer.length >= this.#maxBufferSize) {
      // Notifica o sistema de que o backpressure foi ativado. A chamada é feita
      // de forma não-bloqueante para não travar o processo principal.
      if (this.#callbacks.onBackpressure) {
        Promise.resolve(
          this.#callbacks.onBackpressure({
            bufferSize: this.#buffer.length,
            maxBufferSize: this.#maxBufferSize,
            item, // Informa qual item está aguardando para ser adicionado.
          })
        ).catch((error) => {
          this.#logger.error("Erro no callback onBackpressure.", {
            errorMessage: error.message,
          });
        });
      }

      // Aguarda em um laço até que o buffer tenha espaço novamente.
      while (this.#buffer.length >= this.#maxBufferSize) {
        // Pausa a execução por um curto período para evitar consumo de CPU (busy-waiting)
        // e permite que a event loop processe os flushes em andamento.
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    // O item é adicionado ao buffer somente após a liberação do backpressure.
    this.#buffer.push(item);

    // O callback onAdd é invocado de forma não-bloqueante para não impactar a performance de adição.
    if (this.#callbacks.onAdd) {
      try {
        // `Promise.resolve()` garante que mesmo um onAdd síncrono seja tratado como uma promessa.
        Promise.resolve(
          this.#callbacks.onAdd({
            buffer: this.#buffer,
            payload: this.#payload,
            item,
            serviceContext: this.#serviceContext,
            logger: this.#logger,
          })
        ).catch((error) => {
          this.#logger.error(`Erro não tratado no callback onAdd.`, {
            errorMessage: error.message,
          });
        });
      } catch (syncError) {
        // Este catch é uma segurança extra para callbacks síncronos que podem lançar exceções.
        this.#logger.error(`Erro síncrono no callback onAdd.`, {
          errorMessage: syncError.message,
        });
      }
    }

    // Verifica se o buffer atingiu o limite para um lote e dispara o processamento.
    if (this.#buffer.length >= this.#limit) {
      this.flush();
    }
  }

  /**
   * Dispara o processamento de lotes de forma síncrona e não-bloqueante.
   *
   * Atua como um "despachante": ele verifica o estado atual do buffer e os slots
   * de concorrência disponíveis e inicia quantas operações de processamento (`#executeFlush`)
   * forem possíveis, até o limite de `maxConcurrentFlushes`.
   *
   * Este método é chamado automaticamente pelo `add()` e `end()`, mas também pode ser
   * invocado manualmente para forçar o processamento de um lote parcial.
   */
  flush() {
    // Este laço é o coração da concorrência. Enquanto houver itens e "trabalhadores" (slots)
    // disponíveis, ele continuará despachando novos trabalhos.
    while (
      this.#buffer.length > 0 &&
      this.#activeFlushes < this.#maxConcurrentFlushes
    ) {
      const batch = this.#buffer.splice(0, this.#limit);
      // Dispara a execução sem esperar (fire-and-forget) para permitir que múltiplos
      // flushes ocorram em paralelo. O gerenciamento do estado assíncrono é feito em #executeFlush.
      this.#executeFlush(batch);
    }
  }

  /**
   * O motor de processamento assíncrono para um único lote.
   *
   * Este método privado encapsula toda a lógica complexa de uma operação de flush,
   * incluindo:
   * 1. Gerenciamento do timeout da operação (`flushTimeoutMs`).
   * 2. Implementação da política de retries (`retries` e `retryDelayMs`).
   * 3. Invocação do callback `onFlushFailure` para lotes que falham permanentemente.
   * 4. Gerenciamento do contador de flushes ativos.
   * 5. Disparo reativo do próximo ciclo de `flush` para manter o pipeline de processamento ativo.
   *
   * @private
   * @param {any[]} batch - O lote de itens que esta execução irá processar.
   * @returns {Promise<void>}
   */
  async #executeFlush(batch) {
    // Incrementa o contador de operações ativas. Este é o início do ciclo de vida de um flush.
    this.#activeFlushes++;
    this.#logger.info(
      `Iniciando processamento de lote com ${batch.length} itens. Ativos: ${
        this.#activeFlushes
      }`
    );

    let lastError = null;

    // Laço de tentativas: executa a tentativa inicial (attempt 0) + o número de retries configurado.
    for (let attempt = 0; attempt <= this.#retries; attempt++) {
      try {
        // Caso de borda: se nenhum onFlush for fornecido, descarta o lote intencionalmente.
        if (!this.#callbacks.onFlush) {
          this.#logger.info(
            `Nenhum callback onFlush definido. Lote de ${batch.length} itens descartado.`
          );
          lastError = null; // Garante que não será tratado como uma falha.
          break;
        }

        if (attempt > 0) {
          this.#logger.info(
            `Tentativa ${attempt}/${this.#retries} para o lote.`
          );
        }

        // Executa o onFlush em uma "corrida" contra um timer de timeout.
        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(
            () =>
              reject(
                new Error(`Flush timed out after ${this.#flushTimeoutMs}ms`)
              ),
            this.#flushTimeoutMs
          );
        });

        try {
          await Promise.race([
            this.#callbacks.onFlush({
              batch,
              payload: this.#payload,
              serviceContext: this.#serviceContext,
              logger: this.#logger,
            }),
            timeoutPromise,
          ]);
        } finally {
          // CRÍTICO: Limpa o timeout para evitar que ele dispare mais tarde
          // e cause um unhandled rejection, caso o flush termine antes do tempo.
          clearTimeout(timeoutId);
        }

        // Se a execução chegou aqui, o lote foi processado com sucesso.
        this.#logger.info(
          `Lote de ${batch.length} itens processado com sucesso.`
        );
        lastError = null;
        break; // Sai do laço de retries.
      } catch (error) {
        // Ocorreu uma falha (seja do onFlush ou do timeout).
        lastError = error;

        if (attempt >= this.#retries) {
          // Se esta foi a última tentativa, registra um erro definitivo.
          this.#logger.error(
            `Falha definitiva ao processar o lote após ${attempt} tentativa(s).`,
            {
              errorMessage: error.message,
              batchSize: batch.length,
            }
          );
        } else {
          // Se ainda há tentativas, avisa e aguarda o delay para tentar novamente.
          this.#logger.warn(
            `Falha na tentativa ${attempt} de processar o lote. Tentando novamente em ${
              this.#retryDelayMs
            }ms...`,
            {
              errorMessage: error.message,
            }
          );
          await new Promise((resolve) =>
            setTimeout(resolve, this.#retryDelayMs)
          );
        }
      }
    }

    // --- Pós-processamento do Lote ---

    // Se um erro persistiu após todas as retries, aciona o callback de falha definitiva.
    // Este é o gancho para o usuário implementar uma "dead-letter queue".
    if (lastError && this.#callbacks.onFlushFailure) {
      try {
        await this.#callbacks.onFlushFailure({
          batch,
          error: lastError,
          payload: this.#payload,
          serviceContext: this.#serviceContext,
          logger: this.#logger,
        });
        this.#logger.info(
          `Callback onFlushFailure executado para o lote com falha.`
        );
      } catch (failureCallbackError) {
        // Segurança: captura erros no próprio callback de falha para não quebrar o processador.
        this.#logger.error(`Erro CRÍTICO no próprio callback onFlushFailure.`, {
          errorMessage: failureCallbackError.message,
        });
      }
    }

    // --- Finalização e Reativação ---

    // Decrementa o contador de operações ativas, liberando um slot de concorrência.
    this.#activeFlushes--;
    this.#logger.info(
      `Processamento de lote finalizado. Ativos: ${this.#activeFlushes}`
    );
    // Dispara um novo ciclo de flush. Esta chamada reativa é a chave para manter
    // o processador funcionando em capacidade máxima, preenchendo o slot que acabou de ser liberado.
    this.flush();
  }

  /**
   * Finaliza o processador, garantindo que todos os itens pendentes sejam processados.
   * Este método é idempotente (seguro para ser chamado múltiplas vezes) e DEVE ser
   * invocado ao final do ciclo de vida da aplicação para evitar perda de dados.
   *
   * @param {number} [forceTimeoutMs=30000] - Tempo máximo em milissegundos para aguardar a
   * finalização dos lotes em processamento. Se o tempo for excedido, o processo é
   * encerrado e um aviso é logado com os itens restantes.
   * @returns {Promise<void>} Uma promessa que resolve quando todos os itens forem
   * processados ou quando o timeout for atingido.
   */
  async end(forceTimeoutMs = 30000) {
    // Garante que a lógica de finalização execute apenas uma vez.
    if (this.#isEnding) {
      return;
    }
    // Sinaliza para outras partes do processador (como o método `add`) que o desligamento começou.
    this.#isEnding = true;
    const endStartTime = Date.now();

    this.#logger.info("Finalizando o processador...", {
      itemsNoBuffer: this.#buffer.length,
      activeFlushes: this.#activeFlushes,
    });

    // Executa o callback de finalização do usuário, se fornecido.
    if (this.#callbacks.onEnd) {
      try {
        await this.#callbacks.onEnd({
          payload: this.#payload,
          serviceContext: this.#serviceContext,
          logger: this.#logger,
        });
      } catch (error) {
        this.#logger.error(`Erro no callback onEnd.`, {
          errorMessage: error.message,
        });
      }
    }

    // Dispara um último ciclo de flush para processar qualquer item restante no buffer.
    this.flush();

    // Aguarda o "esvaziamento" do processador, respeitando o timeout.
    // O laço continua enquanto houver itens no buffer ou operações de flush ativas.
    while (
      (this.#buffer.length > 0 || this.#activeFlushes > 0) &&
      Date.now() - endStartTime < forceTimeoutMs
    ) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    // Se o laço terminou mas ainda há trabalho pendente, significa que o timeout foi atingido.
    if (this.#buffer.length > 0 || this.#activeFlushes > 0) {
      this.#logger.warn(
        "Finalização forçada por timeout. Itens não processados foram descartados.",
        {
          remainingItems: this.#buffer.length,
          activeFlushes: this.#activeFlushes,
        }
      );
    }

    this.#logger.info("Processador finalizado.");
    if (this.#callbacks.onFinished) {
      try {
        await this.#callbacks.onFinished({
          payload: this.#payload,
          logger: this.#logger,
          serviceContext: this.#serviceContext,
        });
      } catch (error) {
        this.#logger.error(`Erro no callback onFinished.`, {
          errorMessage: error.message,
        });
      }
    }
  }
}

/**
 * @fileoverview Fornece uma classe para gerenciar estados de espera assíncronos (Promises).
 * @description Este módulo exporta uma instância única (singleton) da WaitPlugin.
 */

/**
 * @class WaitPlugin
 * @summary Gerencia a criação e resolução de Promises "on-demand".
 * @description Utiliza um Map internamente para máxima performance em adições e remoções,
 * enquanto expõe a lista de esperas como um Objeto para compatibilidade e depuração.
 */
class WaitPlugin {
  
  /**
   * Inicializa o plugin.
   * @constructor
   */
  constructor() {
    /**
     * Armazena as esperas ativas. É um Map privado para performance.
     * @private
     * @type {Map<string, {promise: Promise<any>, resolve: Function, reject: Function}>}
     */
    this._waitList = new Map();
  }

  /**
   * Getter público para a lista de esperas.
   * @description Converte o Map interno em um Objeto simples para fins de compatibilidade
   * com testes ou para facilitar a depuração.
   * @returns {Object<string, {promise: Promise<any>, resolve: Function, reject: Function}>}
   */
  get waitList() {
    return Object.fromEntries(this._waitList);
  }

  // ----------------------------------------------------------------------------------------------

  /**
   * Finaliza uma espera, resolvendo ou rejeitando a Promise correspondente.
   *
   * @param {string} name - O nome único da espera a ser finalizada.
   * @param {boolean} [isSuccessful=true] - Se `true`, a Promise será resolvida. Se `false`, será rejeitada.
   * @param {*} [returnParam] - O valor a ser passado para o `resolve` ou `reject` da Promise.
   * @returns {any} Retorna `false` se a espera não existir. Em caso de erro interno, retorna o
   * próprio objeto de erro. Em sucesso, o retorno é indefinido.
   */
  finishWait(name, isSuccessful = true, returnParam) {
    try {
      const waitItem = this._waitList.get(name);
      if (!waitItem) {
        return false;
      }

      if (isSuccessful) {
        waitItem.resolve(returnParam);
      } else {
        waitItem.reject(returnParam);
      }
    } catch (error) {
      return error;
    } finally {
      // A operação delete do Map é segura e performática.
      this._waitList.delete(name);
    }
  }

  // ----------------------------------------------------------------------------------------------

  /**
   * Inicia uma nova espera e retorna uma Promise associada a ela.
   *
   * @param {string} name - O nome único para a nova espera.
   * @returns {Promise<any>|undefined} Retorna a Promise que aguardará a finalização.
   * Retorna `undefined` se uma espera com o mesmo nome já existir.
   */
  startWait(name) {
    if (this._waitList.has(name)) {
      return;
    }
    
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    
    this._waitList.set(name, { promise, resolve, reject });
    
    return promise;
  }

  // ----------------------------------------------------------------------------------------------

  /**
   * Finaliza todas as esperas ativas de uma só vez.
   *
   * @param {boolean} isSuccessful - Se `true`, todas as Promises serão resolvidas. Se `false`, serão rejeitadas.
   * @param {*} [returnParam] - O valor a ser passado para cada `resolve` ou `reject`.
   */
  finishAll(isSuccessful, returnParam) {
    // Cria uma cópia das chaves antes de iterar. É a forma mais segura de
    // modificar uma coleção (neste caso, o Map) enquanto ela está sendo percorrida.
    const allWaitKeys = Array.from(this._waitList.keys());
    
    for (const key of allWaitKeys) {
      this.finishWait(key, isSuccessful, returnParam);
    }
  }

  // ----------------------------------------------------------------------------------------------
}

// ------------------------------------------------------------------------------------------------

/**
 * Instância única (singleton) do WaitPlugin.
 * @type {WaitPlugin}
 */
const WP = new WaitPlugin();

// 1. Importa tudo que será exportado.
//    Usamos 'import * as' para agrupar as funções do sequelize em um único objeto 'db'.

// 3. Agrupa tudo em um objeto e exporta como `default`.
//    Isso permite o uso de: import custom from '...'; custom.waitPlugin
var index = {
  db,
  waitPlugin: WP,
  bulkProcessor: BulkProcessor,
};

declare const customNamespace_db: typeof db;
declare namespace customNamespace {
  export { BulkProcessor as bulkProcessor, customNamespace_db as db, index as default, WP as waitPlugin };
}

// src/index.js


const auth = { webAuthn: authNamespace };
const constants = constantsNamespace;
const crypto$1 = cryptoNamespace;
const custom = {
  db: {
    sequelize: {
      ...db,
    },
  },
  waitPlugin: WP,
  bulkProcessor: BulkProcessor,
};
const helpers = helpersNamespace;
const utils = utilsNamespace;
const validators = validatorsNamespace;

// --- PASSO 3: Exportação Padrão (Default) ---
// Agrupa tudo em um único objeto para a exportação padrão.
// Isso garante que `import miscHelpers from 'misc-helpers'` funcione.
const miscHelpers = {
  auth: authNamespace,
  constants: constantsNamespace,
  crypto: cryptoNamespace,
  custom: customNamespace,
  helpers: helpersNamespace,
  utils: utilsNamespace,
  validators: validatorsNamespace,
};

export { JSONFrom, JSONTo, assign, auth, base64From, base64FromBase64URLSafe, base64FromBuffer, base64To, base64ToBuffer, base64URLEncode, bufferCompare, bufferConcatenate, bufferFromString, bufferToString, BulkProcessor as bulkProcessor, calculateSecondsInTime, cleanObject, constants, convertECDSAASN1Signature, copyObject, crypto$1 as crypto, currencyBRToFloat, custom, dateCompareAsc, dateCompareDesc, dateFirstHourOfDay, dateLastHourOfDay, dateToFormat, debouncer, decrypt, decryptBuffer, miscHelpers as default, defaultNumeric, defaultValue, deleteKeys, digest, encrypt, encryptBuffer, generateRandomString, generateSimpleId, getAuthenticationAuthData, getCrypto, getExecutionTime, getRegistrationAuthData, getWebAuthnAuthenticationAssertion, getWebAuthnRegistrationCredential, helpers, importCryptoKey, isInstanceOf, isNumber, isObject, messageDecryptFromChunks, messageEncryptToChunks, normalize, pickKeys, pushLogMessage, regexDigitsOnly, regexLettersOnly, regexReplaceTrim, removeDuplicatedStrings, setConditionBetweenDates, setConditionBetweenValues, setConditionStringLike, setCrypto, sleep, split, stringCompress, stringDecompress, stringToDate, stringToDateToFormat, stringToFormat, stringZLibCompress, stringZLibDecompress, throttle, timestamp, toString, uint8ArrayFromString, uint8ArrayToString, utils, validateAuthentication, validateCADICMSPR, validateCEP, validateCNH, validateCNPJ, validateCPF, validateChavePix, validateEmail, validatePISPASEPNIT, validateRG, validateRPID, validateRegistration, validateRENAVAM as validateRenavam, validateTituloEleitor, validators, verifySignature, WP as waitPlugin };
